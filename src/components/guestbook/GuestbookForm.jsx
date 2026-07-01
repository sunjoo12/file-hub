import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import SendIcon from '@mui/icons-material/Send';

/**
 * GuestbookForm 컴포넌트 — 방명록 작성 폼
 *
 * Props:
 * @param {function} onSubmit - 작성 완료 핸들러 ({ author, content, password }) => Promise [Required]
 *
 * Example usage:
 * <GuestbookForm onSubmit={createEntry} />
 */
function GuestbookForm({ onSubmit }) {
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const passwordMismatch = confirmPassword && password !== confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!author.trim() || !content.trim() || !password) return;
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (password.length < 4) {
      setError('비밀번호는 4자 이상이어야 합니다.');
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({ author: author.trim(), content: content.trim(), password });
      setAuthor('');
      setContent('');
      setPassword('');
      setConfirmPassword('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || '작성에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      component='form'
      onSubmit={handleSubmit}
      sx={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #D0EFF8',
        borderRadius: '16px',
        p: { xs: 2.5, md: 3 },
        mb: 3,
        background: 'linear-gradient(135deg, #F8FCFF 0%, #EEF7FC 100%)',
      }}
    >
      <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#1D3557', mb: 2 }}>
        방명록 작성
      </Typography>

      {/* 이름 + 비밀번호 */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
        <TextField
          label='이름'
          value={author}
          onChange={(e) => setAuthor(e.target.value.slice(0, 50))}
          size='small'
          required
          inputProps={{ maxLength: 50 }}
          sx={{
            flex: { xs: '1 1 100%', sm: '1 1 auto' },
            '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: '#5B9EC9' },
            '& .MuiInputLabel-root.Mui-focused': { color: '#5B9EC9' },
          }}
        />
        <TextField
          label='비밀번호'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          size='small'
          required
          placeholder='4자 이상'
          sx={{
            flex: { xs: '1 1 calc(50% - 6px)', sm: '0 0 140px' },
            '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: '#5B9EC9' },
            '& .MuiInputLabel-root.Mui-focused': { color: '#5B9EC9' },
          }}
        />
        <TextField
          label='비밀번호 확인'
          type='password'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          size='small'
          required
          error={passwordMismatch}
          helperText={passwordMismatch ? '비밀번호 불일치' : ''}
          sx={{
            flex: { xs: '1 1 calc(50% - 6px)', sm: '0 0 140px' },
            '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: '#5B9EC9' },
            '& .MuiInputLabel-root.Mui-focused': { color: '#5B9EC9' },
          }}
        />
      </Box>

      {/* 내용 */}
      <TextField
        label='내용'
        value={content}
        onChange={(e) => setContent(e.target.value)}
        multiline
        minRows={3}
        maxRows={8}
        fullWidth
        size='small'
        required
        placeholder='방명록에 남기고 싶은 말을 적어주세요.'
        sx={{
          mb: 1.5,
          '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: '#5B9EC9' },
          '& .MuiInputLabel-root.Mui-focused': { color: '#5B9EC9' },
        }}
      />

      {error && <Alert severity='error' sx={{ mb: 1.5, fontSize: 13 }}>{error}</Alert>}
      {success && <Alert severity='success' sx={{ mb: 1.5, fontSize: 13 }}>방명록이 등록되었습니다!</Alert>}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type='submit'
          variant='contained'
          disabled={submitting || passwordMismatch || !author.trim() || !content.trim() || !password || !confirmPassword}
          startIcon={submitting
            ? <CircularProgress size={16} sx={{ color: '#fff' }} />
            : <SendIcon sx={{ fontSize: 18 }} />
          }
          sx={{
            textTransform: 'none',
            fontSize: 14,
            fontWeight: 600,
            borderRadius: '8px',
            px: 3,
            backgroundColor: '#5B9EC9',
            '&:hover': { backgroundColor: '#4A8AB5' },
            '&.Mui-disabled': { backgroundColor: '#A8D8EE', color: '#fff' },
          }}
        >
          등록
        </Button>
      </Box>
    </Box>
  );
}

export default GuestbookForm;
