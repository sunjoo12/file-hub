import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Box from '@mui/material/Box';

/**
 * PasswordDialog 컴포넌트 — 비밀번호 입력 다이얼로그
 *
 * Props:
 * @param {boolean} isOpen - 다이얼로그 열림 여부 [Required]
 * @param {string} title - 다이얼로그 제목 [Required]
 * @param {string} errorMessage - 비밀번호 오류 메시지 [Optional]
 * @param {boolean} isLoading - 처리 중 여부 [Optional, 기본값: false]
 * @param {function} onConfirm - 확인 버튼 핸들러 (password: string) => void [Required]
 * @param {function} onClose - 닫기 핸들러 () => void [Required]
 *
 * Example usage:
 * <PasswordDialog isOpen={open} title="삭제 확인" onConfirm={handleConfirm} onClose={handleClose} />
 */
function PasswordDialog({ isOpen, title, errorMessage, isLoading = false, onConfirm, onClose }) {
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isOpen) setPassword('');
  }, [isOpen]);

  const handleSubmit = () => {
    if (password.trim()) onConfirm(password);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth='xs' fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: 16, fontWeight: 700, pb: 1 }}>
        <LockOutlinedIcon sx={{ fontSize: 20, color: '#5B9EC9' }} />
        {title}
      </DialogTitle>
      <DialogContent sx={{ pt: '8px !important' }}>
        <Box sx={{ fontSize: 13, color: 'text.secondary', mb: 2 }}>
          작성 시 설정한 비밀번호를 입력해 주세요.
        </Box>
        <TextField
          label='비밀번호'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
          error={!!errorMessage}
          helperText={errorMessage}
          fullWidth
          autoFocus
          size='small'
          sx={{
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': { borderColor: '#5B9EC9' },
            },
            '& .MuiInputLabel-root.Mui-focused': { color: '#5B9EC9' },
          }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button
          onClick={onClose}
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
          onClick={handleSubmit}
          variant='contained'
          size='small'
          disabled={!password.trim() || isLoading}
          startIcon={isLoading ? <CircularProgress size={14} sx={{ color: '#fff' }} /> : null}
          sx={{
            textTransform: 'none',
            borderRadius: '8px',
            backgroundColor: '#5B9EC9',
            fontWeight: 600,
            '&:hover': { backgroundColor: '#4A8AB5' },
            '&.Mui-disabled': { backgroundColor: '#A8D8EE', color: '#fff' },
          }}
        >
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PasswordDialog;
