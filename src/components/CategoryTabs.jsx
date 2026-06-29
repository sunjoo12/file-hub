import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import ImageIcon from '@mui/icons-material/Image';
import DescriptionIcon from '@mui/icons-material/Description';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import CodeIcon from '@mui/icons-material/Code';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const TABS = [
  { value: 'all', label: '전체', Icon: AllInclusiveIcon },
  { value: 'image', label: '이미지', Icon: ImageIcon },
  { value: 'document', label: '문서', Icon: DescriptionIcon },
  { value: 'video', label: '영상', Icon: VideoLibraryIcon },
  { value: 'archive', label: '압축파일', Icon: FolderZipIcon },
  { value: 'code', label: '코드', Icon: CodeIcon },
  { value: 'other', label: '기타', Icon: MoreHorizIcon },
];

/**
 * CategoryTabs 컴포넌트
 * - 데스크톱(md+): 아이시스 컬러 적용 좌측 세로 탭 (EmploYee GNB 스타일)
 * - 모바일(xs~sm): 상단 수평 스크롤 탭
 *
 * Props:
 * @param {string} value - 현재 선택된 탭 값 [Required]
 * @param {function} onChange - 탭 변경 핸들러 [Required]
 *
 * Example usage:
 * <CategoryTabs value={category} onChange={setCategory} />
 */
function CategoryTabs({ value, onChange }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  if (isDesktop) {
    return (
      <Box sx={{
        width: 152,
        flexShrink: 0,
        borderRight: '1px solid #D0EFF8',
        background: 'linear-gradient(180deg, #EEF7FC 0%, #E2F2FA 100%)',
        display: 'flex',
        flexDirection: 'column',
        py: 2,
        px: 1,
      }}>
        {/* 섹션 라벨 */}
        <Typography sx={{
          fontSize: 11,
          fontWeight: 600,
          color: '#5A7A9A',
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          px: 1.5,
          mb: 1,
        }}>
          카테고리
        </Typography>

        <Tabs
          value={value}
          onChange={(_, v) => onChange(v)}
          orientation='vertical'
          sx={{
            '& .MuiTabs-indicator': { display: 'none' },
            '& .MuiTab-root': {
              minHeight: 40,
              justifyContent: 'flex-start',
              textTransform: 'none',
              fontSize: 13,
              fontWeight: 500,
              color: '#5A7A9A',
              borderRadius: '8px',
              px: 1.5,
              mb: 0.5,
              minWidth: 0,
              width: '100%',
              gap: 1,
              transition: 'all 0.18s ease',
              '&:hover': {
                backgroundColor: '#D0EFF8',
                color: '#1D3557',
              },
            },
            '& .Mui-selected': {
              backgroundColor: '#A8D8EE !important',
              color: '#1D3557 !important',
              fontWeight: 700,
              borderLeft: '3px solid #FF5C8F',
              pl: '9px',
            },
          }}
        >
          {TABS.map(({ value: tabValue, label, Icon }) => (
            <Tab
              key={tabValue}
              value={tabValue}
              label={label}
              icon={<Icon sx={{ fontSize: 16 }} />}
              iconPosition='start'
            />
          ))}
        </Tabs>
      </Box>
    );
  }

  // 모바일/태블릿: 상단 수평 탭 — 아이시스 컬러 적용
  return (
    <Box sx={{
      borderBottom: '1px solid #D0EFF8',
      backgroundColor: '#EEF7FC',
    }}>
      <Tabs
        value={value}
        onChange={(_, v) => onChange(v)}
        variant='scrollable'
        scrollButtons='auto'
        sx={{
          minHeight: 48,
          '& .MuiTabs-indicator': {
            backgroundColor: '#FF5C8F',
            height: 3,
            borderRadius: '3px 3px 0 0',
          },
          '& .MuiTab-root': {
            minHeight: 48,
            textTransform: 'none',
            fontSize: 13,
            fontWeight: 500,
            color: '#5A7A9A',
            transition: 'all 0.18s ease',
            '&:hover': { color: '#1D3557', backgroundColor: '#D0EFF8' },
          },
          '& .Mui-selected': {
            color: '#1D3557 !important',
            fontWeight: 700,
          },
        }}
      >
        {TABS.map(({ value: tabValue, label, Icon }) => (
          <Tab
            key={tabValue}
            value={tabValue}
            label={label}
            icon={<Icon sx={{ fontSize: 16 }} />}
            iconPosition='start'
            sx={{ gap: 0.5, px: 2 }}
          />
        ))}
      </Tabs>
    </Box>
  );
}

export default CategoryTabs;
