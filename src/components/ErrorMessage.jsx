import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';

/**
 * ErrorMessage 컴포넌트 — 에러 메시지 표시
 *
 * Props:
 * @param {string} message - 에러 메시지 [Optional]
 *
 * Example usage:
 * <ErrorMessage message='파일 로드 실패' />
 */
function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <Box sx={{ mb: 2 }}>
      <Alert severity='error' sx={{ fontSize: 14 }}>
        {message}
      </Alert>
    </Box>
  );
}

export default ErrorMessage;
