import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import FileCard from './FileCard';
import EmptyState from './EmptyState';
import LoadingState from './LoadingState';
import { useDelete } from '../hooks/useDelete';

/**
 * FileList 컴포넌트 — 파일 목록 컨테이너 (전체선택 + 삭제 기능 포함)
 *
 * Props:
 * @param {Array} files - 파일 목록 배열 [Required]
 * @param {boolean} isLoading - 로딩 상태 [Required]
 * @param {string} category - 현재 카테고리 (EmptyState에 전달) [Optional]
 * @param {function} onDeleteComplete - 삭제 완료 후 목록 갱신 콜백 [Required]
 *
 * Example usage:
 * <FileList files={files} isLoading={loading} category='image' onDeleteComplete={refetch} />
 */
function FileList({ files, isLoading, category, onDeleteComplete }) {
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null); // null = 선택 일괄삭제, file object = 단일삭제
  const { deleting, deleteError, deleteFiles } = useDelete(onDeleteComplete);

  // 파일 목록 변경 시 존재하지 않는 선택 ID 정리
  useEffect(() => {
    setSelectedIds((prev) => {
      const fileIdSet = new Set(files.map((f) => f.id));
      const next = new Set([...prev].filter((id) => fileIdSet.has(id)));
      return next.size !== prev.size ? next : prev;
    });
  }, [files]);

  if (isLoading) return <LoadingState />;
  if (!files || files.length === 0) return <EmptyState category={category} />;

  const allSelected = files.length > 0 && selectedIds.size === files.length;
  const someSelected = selectedIds.size > 0;

  const handleSelectAll = (checked) => {
    setSelectedIds(checked ? new Set(files.map((f) => f.id)) : new Set());
  };

  const handleSelect = (id, checked) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleDeleteSingle = (file) => {
    setPendingDelete(file);
    setConfirmOpen(true);
  };

  const handleDeleteBulk = () => {
    setPendingDelete(null);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setConfirmOpen(false);
    const toDelete = pendingDelete
      ? [pendingDelete]
      : files.filter((f) => selectedIds.has(f.id));
    await deleteFiles(toDelete);
    if (!pendingDelete) setSelectedIds(new Set());
  };

  const deleteTargetCount = pendingDelete ? 1 : selectedIds.size;

  return (
    <>
      {/* 선택 툴바 */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 1,
        py: 0.75,
        mb: 1.5,
        borderRadius: '8px',
        backgroundColor: someSelected ? '#EEF7FC' : 'transparent',
        border: someSelected ? '1px solid #D0EFF8' : '1px solid transparent',
        transition: 'all 0.2s ease',
        minHeight: 40,
      }}>
        <Checkbox
          checked={allSelected}
          indeterminate={someSelected && !allSelected}
          onChange={(e) => handleSelectAll(e.target.checked)}
          size='small'
          sx={{
            p: 0.5,
            color: '#CBD5E1',
            '&.Mui-checked': { color: '#5B9EC9' },
            '&.MuiCheckbox-indeterminate': { color: '#5B9EC9' },
          }}
        />
        <Typography sx={{
          fontSize: 13,
          color: someSelected ? '#1D3557' : 'text.secondary',
          fontWeight: someSelected ? 600 : 400,
          userSelect: 'none',
        }}>
          {someSelected ? `${selectedIds.size}개 선택됨` : `전체 선택 (${files.length}개)`}
        </Typography>

        {someSelected && (
          <Button
            variant='contained'
            startIcon={deleting
              ? <CircularProgress size={14} sx={{ color: '#fff' }} />
              : <DeleteSweepIcon sx={{ fontSize: 18 }} />
            }
            onClick={handleDeleteBulk}
            disabled={deleting}
            size='small'
            sx={{
              ml: 'auto',
              backgroundColor: '#EF4444',
              textTransform: 'none',
              fontSize: 13,
              fontWeight: 600,
              borderRadius: '8px',
              px: 2,
              minHeight: 32,
              '&:hover': { backgroundColor: '#DC2626' },
              '&.Mui-disabled': { backgroundColor: '#FCA5A5', color: '#fff' },
            }}
          >
            선택 삭제
          </Button>
        )}
      </Box>

      {/* 삭제 오류 메시지 */}
      {deleteError && (
        <Alert severity='error' sx={{ mb: 1.5, fontSize: 13 }}>
          삭제 실패: {deleteError}
        </Alert>
      )}

      {/* 파일 목록 */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {files.map((file) => (
          <FileCard
            key={file.id}
            file={file}
            isSelected={selectedIds.has(file.id)}
            onSelect={handleSelect}
            onDelete={() => handleDeleteSingle(file)}
          />
        ))}
      </Box>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth='xs' fullWidth>
        <DialogTitle sx={{ fontSize: 16, fontWeight: 700, pb: 1, color: 'text.primary' }}>
          파일 삭제
        </DialogTitle>
        <DialogContent sx={{ pt: '8px !important', pb: 1 }}>
          <Typography sx={{ fontSize: 14, color: 'text.secondary', lineHeight: 1.6 }}>
            {pendingDelete ? (
              <>
                <Box component='span' sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {pendingDelete.original_name}
                </Box>
                을(를) 삭제하시겠습니까?
              </>
            ) : (
              <>
                선택한{' '}
                <Box component='span' sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {deleteTargetCount}개
                </Box>
                의 파일을 삭제하시겠습니까?
              </>
            )}
          </Typography>
          <Typography sx={{ fontSize: 13, color: '#EF4444', mt: 1 }}>
            삭제된 파일은 복구할 수 없습니다.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={() => setConfirmOpen(false)}
            variant='outlined'
            size='small'
            sx={{
              textTransform: 'none',
              borderRadius: '8px',
              borderColor: '#CBD5E1',
              color: 'text.secondary',
              '&:hover': { borderColor: '#94A3B8', backgroundColor: '#F8FAFC' },
            }}
          >
            취소
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant='contained'
            size='small'
            sx={{
              textTransform: 'none',
              borderRadius: '8px',
              backgroundColor: '#EF4444',
              fontWeight: 600,
              '&:hover': { backgroundColor: '#DC2626' },
            }}
          >
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default FileList;
