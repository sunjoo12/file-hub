import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { getCategory } from '../utils/fileCategory';

/**
 * 파일 업로드 로직을 처리하는 커스텀 훅
 * @param {function} onUploadComplete - 업로드 완료 후 콜백
 * @returns {{ uploading, progress, uploadError, successCount, uploadFiles }}
 */
export function useUpload(onUploadComplete) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [successCount, setSuccessCount] = useState(0);

  const uploadFiles = useCallback(async (fileList) => {
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList);
    setUploading(true);
    setUploadError(null);
    setSuccessCount(0);
    setProgress(0);

    let completed = 0;
    const errors = [];

    const MAX_SIZE = 100 * 1024 * 1024; // 100MB

    for (const file of files) {
      try {
        if (file.size > MAX_SIZE) {
          throw new Error(`파일 크기 초과 (${(file.size / 1024 / 1024).toFixed(1)}MB / 최대 100MB)`);
        }

        const ext = file.name.includes('.') ? file.name.split('.').pop().toLowerCase() : '';
        const uniqueId = crypto.randomUUID();
        // 한글·공백·특수문자가 포함된 원본 파일명 대신 UUID+확장자로 저장 경로 생성
        const storedName = ext ? `${Date.now()}_${uniqueId}.${ext}` : `${Date.now()}_${uniqueId}`;
        const storagePath = `uploads/${storedName}`;
        const mimeType = file.type || 'application/octet-stream';
        const category = getCategory(mimeType);

        // 1단계: Storage 업로드
        const { error: storageError } = await supabase.storage
          .from('file-storage')
          .upload(storagePath, file, { upsert: false });

        if (storageError) throw new Error(`스토리지 업로드 실패: ${storageError.message}`);

        // 2단계: DB 메타데이터 저장
        const { error: dbError } = await supabase.from('files').insert({
          original_name: file.name,
          stored_name: storedName,
          storage_path: storagePath,
          extension: ext,
          mime_type: mimeType,
          size: file.size,
          category,
        });

        if (dbError) {
          // DB 실패 시 Storage 파일 롤백
          await supabase.storage.from('file-storage').remove([storagePath]);
          throw new Error(`DB 저장 실패 (스토리지 롤백 완료): ${dbError.message}`);
        }

        completed++;
        setSuccessCount(completed);
        setProgress(Math.round((completed / files.length) * 100));
      } catch (err) {
        errors.push(`${file.name}: ${err.message}`);
      }
    }

    setUploading(false);

    if (errors.length > 0) {
      setUploadError(errors.join('\n'));
    }

    if (completed > 0) {
      onUploadComplete?.();
    }

    // 성공/에러 메시지 모두 4초 후 초기화
    setTimeout(() => {
      setProgress(0);
      setSuccessCount(0);
      setUploadError(null);
    }, 4000);
  }, [onUploadComplete]);

  return { uploading, progress, uploadError, successCount, uploadFiles };
}
