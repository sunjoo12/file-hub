import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

/**
 * EmptyState 컴포넌트 — 파일이 없을 때 표시
 *
 * Props:
 * @param {string} category - 현재 선택된 카테고리 [Optional]
 *
 * Example usage:
 * <EmptyState category='image' />
 */
function EmptyState({ category }) {
  const isFiltered = category && category !== 'all';

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      py: 10,
      gap: 2,
    }}>
      <FolderOpenIcon sx={{ fontSize: 72, color: '#CBD5E1' }} />
      <Typography sx={{ fontSize: 16, fontWeight: 600, color: 'text.secondary' }}>
        {isFiltered ? '해당 카테고리에 파일이 없습니다' : '업로드된 파일이 없습니다'}
      </Typography>
      <Typography sx={{ fontSize: 14, color: '#94A3B8' }}>
        위 업로드 영역에서 파일을 추가해보세요
      </Typography>
    </Box>
  );
}

export default EmptyState;
