import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

/**
 * LoadingState 컴포넌트 — 데이터 로딩 중 표시
 *
 * Example usage:
 * <LoadingState />
 */
function LoadingState() {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      py: 10,
      gap: 2,
    }}>
      <CircularProgress size={40} thickness={4} />
      <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
        파일 목록을 불러오는 중...
      </Typography>
    </Box>
  );
}

export default LoadingState;
