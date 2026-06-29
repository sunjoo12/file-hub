import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * 파일 삭제 커스텀 훅 — Supabase Storage + DB 동시 삭제
 * @param {function} onDeleteComplete - 삭제 완료 후 목록 갱신 콜백
 * @returns {{ deleting, deleteError, deleteFiles }}
 */
export function useDelete(onDeleteComplete) {
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const deleteFiles = useCallback(async (fileObjects) => {
    if (!fileObjects?.length) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const storagePaths = fileObjects.map((f) => f.storage_path);
      const ids = fileObjects.map((f) => f.id);

      const { error: storageError } = await supabase.storage
        .from('file-storage')
        .remove(storagePaths);
      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('files')
        .delete()
        .in('id', ids);
      if (dbError) throw dbError;

      onDeleteComplete?.();
    } catch (err) {
      setDeleteError(err.message || '삭제에 실패했습니다.');
    } finally {
      setDeleting(false);
    }
  }, [onDeleteComplete]);

  return { deleting, deleteError, deleteFiles };
}
