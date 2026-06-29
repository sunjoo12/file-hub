import { useState, useRef, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { useUpload } from '../hooks/useUpload';

/**
 * UploadArea 컴포넌트 — 드래그&드롭 + 파일/폴더 업로드 영역
 *
 * Props:
 * @param {function} onUploadComplete - 업로드 완료 후 파일 목록 갱신 콜백 [Required]
 *
 * Example usage:
 * <UploadArea onUploadComplete={refetch} />
 */
function UploadArea({ onUploadComplete }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);
  const { uploading, progress, uploadError, successCount, uploadFiles } = useUpload(onUploadComplete);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    // 자식 요소로 이동할 때는 드래그 상태 유지 (flickering 방지)
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files);
    }
  }, [uploadFiles]);

  const handleFileChange = useCallback((e) => {
    if (e.target.files?.length > 0) {
      uploadFiles(e.target.files);
      e.target.value = '';
    }
  }, [uploadFiles]);

  return (
    <Box sx={{ mb: 3 }}>
      {/* 드래그&드롭 박스 */}
      <Box
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        sx={{
          border: `2px dashed ${isDragging ? '#2563EB' : '#CBD5E1'}`,
          borderRadius: '16px',
          backgroundColor: isDragging ? '#EFF6FF' : '#F8FAFC',
          p: { xs: 4, md: 6 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          cursor: uploading ? 'default' : 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': !uploading ? {
            borderColor: '#2563EB',
            backgroundColor: '#EFF6FF',
          } : {},
        }}
      >
        <CloudUploadIcon sx={{
          fontSize: 56,
          color: isDragging ? 'primary.main' : '#94A3B8',
          transition: 'color 0.2s',
        }} />

        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={{ fontSize: 16, fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
            {isDragging ? '여기에 파일을 놓으세요' : '파일을 드래그하거나 클릭하여 업로드'}
          </Typography>
          <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
            이미지, 문서, 영상, 압축파일, 코드 등 모든 파일 지원 · 최대 100MB
          </Typography>
        </Box>

        {/* 버튼 */}
        <Box
          sx={{ display: 'flex', gap: 1.5, mt: 1, flexWrap: 'wrap', justifyContent: 'center' }}
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant='contained'
            startIcon={<CloudUploadIcon />}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            sx={{ textTransform: 'none', fontSize: 14, borderRadius: '8px', px: 3 }}
          >
            파일 선택
          </Button>
          <Button
            variant='outlined'
            startIcon={<FolderOpenIcon />}
            onClick={() => folderInputRef.current?.click()}
            disabled={uploading}
            sx={{ textTransform: 'none', fontSize: 14, borderRadius: '8px', px: 3 }}
          >
            폴더 선택
          </Button>
        </Box>

        {/* 숨겨진 input */}
        <input
          ref={fileInputRef}
          type='file'
          multiple
          hidden
          onChange={handleFileChange}
        />
        <input
          ref={folderInputRef}
          type='file'
          multiple
          hidden
          webkitdirectory=''
          onChange={handleFileChange}
        />
      </Box>

      {/* 업로드 진행률 */}
      {uploading && (
        <Box sx={{ mt: 2, px: 0.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
              업로드 중...
            </Typography>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'primary.main' }}>
              {progress}%
            </Typography>
          </Box>
          <LinearProgress
            variant='determinate'
            value={progress}
            sx={{ height: 6, borderRadius: 3 }}
          />
        </Box>
      )}

      {/* 일부 성공 + 일부 실패 */}
      {!uploading && successCount > 0 && uploadError && (
        <Alert severity='warning' sx={{ mt: 2, fontSize: 14 }}>
          {successCount}개 업로드 완료 · 일부 파일 실패: {uploadError}
        </Alert>
      )}

      {/* 전체 성공 */}
      {!uploading && successCount > 0 && !uploadError && (
        <Alert severity='success' sx={{ mt: 2, fontSize: 14 }}>
          {successCount}개 파일이 성공적으로 업로드되었습니다.
        </Alert>
      )}

      {/* 전체 실패 */}
      {!uploading && successCount === 0 && uploadError && (
        <Alert severity='error' sx={{ mt: 2, fontSize: 14 }}>
          {uploadError}
        </Alert>
      )}
    </Box>
  );
}

export default UploadArea;
