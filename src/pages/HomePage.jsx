import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import BookIcon from '@mui/icons-material/Book';
import { Link } from 'react-router-dom';
import { useFiles } from '../hooks/useFiles';
import UploadArea from '../components/UploadArea';
import CategoryTabs from '../components/CategoryTabs';
import SearchBar from '../components/SearchBar';
import SortSelect from '../components/SortSelect';
import FileList from '../components/FileList';
import ErrorMessage from '../components/ErrorMessage';

function sortFiles(files, sortBy) {
  return [...files].sort((a, b) => {
    switch (sortBy) {
      case 'newest': return new Date(b.created_at) - new Date(a.created_at);
      case 'oldest': return new Date(a.created_at) - new Date(b.created_at);
      case 'name_asc': return a.original_name.localeCompare(b.original_name, 'ko');
      case 'size_desc': return b.size - a.size;
      case 'size_asc': return a.size - b.size;
      default: return 0;
    }
  });
}

function HomePage() {
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const { files, loading, error, refetch } = useFiles();

  const filteredFiles = useMemo(() => {
    let result = files;
    if (category !== 'all') {
      result = result.filter((f) => f.category === category);
    }
    if (search.trim()) {
      const keyword = search.toLowerCase().trim();
      result = result.filter((f) => f.original_name.toLowerCase().includes(keyword));
    }
    return sortFiles(result, sortBy);
  }, [files, category, search, sortBy]);

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      {/* 헤더 */}
      <Box sx={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        py: { xs: 2.5, md: 3 },
      }}>
        <Container maxWidth='lg'>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography sx={{
              fontSize: { xs: '1.4rem', md: '1.75rem' },
              fontWeight: 800,
              color: 'text.primary',
              letterSpacing: '-0.5px',
            }}>
              SJ File_Hub
            </Typography>
            <Button
              component={Link}
              to='/guestbook'
              startIcon={<BookIcon sx={{ fontSize: 18 }} />}
              size='small'
              variant='outlined'
              sx={{
                textTransform: 'none',
                fontSize: 13,
                fontWeight: 600,
                borderRadius: '8px',
                borderColor: '#A8D8EE',
                color: '#5B9EC9',
                px: 2,
                '&:hover': { backgroundColor: '#EEF7FC', borderColor: '#5B9EC9' },
              }}
            >
              방명록
            </Button>
          </Box>
          <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
            파일을 업로드하고 팀원들과 안전하게 공유하세요 · Supabase 기반 영구 저장
          </Typography>
        </Container>
      </Box>

      <Container maxWidth='lg' sx={{ py: { xs: 3, md: 4 } }}>
        {/* 업로드 영역 */}
        <UploadArea onUploadComplete={refetch} />

        {/* 전체 에러 메시지 */}
        <ErrorMessage message={error} />

        {/* 파일 목록 카드 */}
        <Box sx={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
        }}>
          {/* 카테고리 탭 — 데스크톱: 좌측 세로 / 모바일: 상단 수평 */}
          <CategoryTabs value={category} onChange={(v) => { setCategory(v); setSearch(''); }} />

          {/* 우측(데스크톱) / 하단(모바일) 콘텐츠 영역 */}
          <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            {/* 검색 + 정렬 + 파일 수 */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: { xs: 2, md: 2.5 },
              py: 2,
              borderBottom: '1px solid #F1F5F9',
              flexWrap: 'wrap',
            }}>
              <SearchBar value={search} onChange={setSearch} />
              <Box sx={{ ml: { xs: 0, sm: 'auto' }, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <SortSelect value={sortBy} onChange={setSortBy} />
                <Divider orientation='vertical' flexItem sx={{ height: 28, my: 'auto' }} />
                <Typography sx={{ fontSize: 13, color: 'text.secondary', whiteSpace: 'nowrap' }}>
                  {filteredFiles.length}개
                </Typography>
              </Box>
            </Box>

            {/* 파일 목록 */}
            <Box sx={{ p: { xs: 2, md: 2.5 }, flex: 1 }}>
              <FileList files={filteredFiles} isLoading={loading} category={category} onDeleteComplete={refetch} />
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default HomePage;
