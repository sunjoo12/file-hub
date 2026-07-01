import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import PasswordDialog from './PasswordDialog';

/**
 * GuestbookEntry 컴포넌트 — 방명록 개별 항목
 *
 * Props:
 * @param {object} entry - 방명록 항목 데이터 [Required]
 * @param {function} onUpdate - 수정 핸들러 (entryId, { content, password }) => Promise [Required]
 * @param {function} onDelete - 삭제 핸들러 (entryId, password) => Promise [Required]
 *
 * Example usage:
 * <GuestbookEntry entry={entry} onUpdate={updateEntry} onDelete={deleteEntry} />
 */
function GuestbookEntry({ entry, onUpdate, onDelete }) {
  const [actionMode, setActionMode] = useState(null); // 'edit' | 'delete' | null
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState(entry.content);
  const [passwordError, setPasswordError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const date = new Date(entry.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const time = new Date(entry.created_at).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const isEdited = entry.updated_at !== entry.created_at;
  const avatarLetter = entry.author?.charAt(0)?.toUpperCase() || '?';

  const handlePasswordConfirm = async (password) => {
    setPasswordError('');
    setSubmitting(true);
    try {
      if (actionMode === 'delete') {
        await onDelete(entry.id, password);
        setActionMode(null);
      } else if (actionMode === 'edit') {
        setActionMode(null);
        setEditContent(entry.content);
        setEditMode(true);
        // 패스워드를 edit mode에 전달하기 위해 임시 저장
        setPendingPassword(password);
      }
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const [pendingPassword, setPendingPassword] = useState('');

  const handleSaveEdit = async () => {
    if (!editContent.trim()) return;
    setSubmitting(true);
    try {
      await onUpdate(entry.id, { content: editContent.trim(), password: pendingPassword });
      setEditMode(false);
      setPendingPassword('');
    } catch (err) {
      // 수정 중 오류 — 메시지를 인라인으로 표시할 공간이 없으므로 alert 사용
      alert(`수정 실패: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditContent(entry.content);
    setPendingPassword('');
  };

  return (
    <>
      <Box sx={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '12px',
        p: { xs: 2, md: 2.5 },
        transition: 'box-shadow 0.2s ease',
        '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.07)' },
      }}>
        {/* 헤더 */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: editMode ? 1.5 : 1 }}>
          <Avatar sx={{
            width: 36,
            height: 36,
            fontSize: 15,
            fontWeight: 700,
            backgroundColor: '#A8D8EE',
            color: '#1D3557',
            flexShrink: 0,
          }}>
            {avatarLetter}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#1D3557' }}>
                {entry.author}
              </Typography>
              <Typography sx={{ fontSize: 12, color: '#94A3B8' }}>
                {date} {time}
              </Typography>
              {isEdited && (
                <Typography sx={{ fontSize: 11, color: '#A8D8EE', fontWeight: 500 }}>
                  (수정됨)
                </Typography>
              )}
            </Box>
          </Box>

          {/* 수정/삭제 버튼 */}
          {!editMode && (
            <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
              <Tooltip title='수정' placement='top'>
                <IconButton
                  size='small'
                  onClick={() => { setActionMode('edit'); setPasswordError(''); }}
                  sx={{
                    color: '#5B9EC9',
                    backgroundColor: '#EEF7FC',
                    '&:hover': { backgroundColor: '#D0EFF8' },
                  }}
                >
                  <EditIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title='삭제' placement='top'>
                <IconButton
                  size='small'
                  onClick={() => { setActionMode('delete'); setPasswordError(''); }}
                  sx={{
                    color: '#EF4444',
                    backgroundColor: '#FEF2F2',
                    '&:hover': { backgroundColor: '#FEE2E2' },
                  }}
                >
                  <DeleteIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>

        {/* 본문 */}
        {editMode ? (
          <Box sx={{ ml: '52px' }}>
            <TextField
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              multiline
              minRows={3}
              maxRows={8}
              fullWidth
              size='small'
              autoFocus
              sx={{
                mb: 1.5,
                '& .MuiOutlinedInput-root': {
                  fontSize: 14,
                  '&.Mui-focused fieldset': { borderColor: '#5B9EC9' },
                },
              }}
            />
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button
                size='small'
                onClick={handleCancelEdit}
                startIcon={<CloseIcon sx={{ fontSize: 16 }} />}
                sx={{
                  textTransform: 'none',
                  fontSize: 13,
                  borderRadius: '8px',
                  color: 'text.secondary',
                  '&:hover': { backgroundColor: '#F8FAFC' },
                }}
              >
                취소
              </Button>
              <Button
                size='small'
                variant='contained'
                onClick={handleSaveEdit}
                disabled={!editContent.trim() || submitting}
                startIcon={submitting
                  ? <CircularProgress size={14} sx={{ color: '#fff' }} />
                  : <CheckIcon sx={{ fontSize: 16 }} />
                }
                sx={{
                  textTransform: 'none',
                  fontSize: 13,
                  fontWeight: 600,
                  borderRadius: '8px',
                  backgroundColor: '#5B9EC9',
                  '&:hover': { backgroundColor: '#4A8AB5' },
                  '&.Mui-disabled': { backgroundColor: '#A8D8EE', color: '#fff' },
                }}
              >
                저장
              </Button>
            </Box>
          </Box>
        ) : (
          <Typography sx={{
            fontSize: 14,
            color: 'text.primary',
            lineHeight: 1.7,
            ml: '52px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}>
            {entry.content}
          </Typography>
        )}
      </Box>

      {/* 비밀번호 확인 다이얼로그 */}
      <PasswordDialog
        isOpen={actionMode !== null}
        title={actionMode === 'delete' ? '삭제 확인' : '수정 확인'}
        errorMessage={passwordError}
        isLoading={submitting}
        onConfirm={handlePasswordConfirm}
        onClose={() => { setActionMode(null); setPasswordError(''); }}
      />
    </>
  );
}

export default GuestbookEntry;
