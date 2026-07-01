import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BookIcon from '@mui/icons-material/Book';
import { Link } from 'react-router-dom';
import { useGuestbook } from '../hooks/useGuestbook';
import GuestbookForm from '../components/guestbook/GuestbookForm';
import GuestbookEntry from '../components/guestbook/GuestbookEntry';

function GuestbookPage() {
  const { entries, loading, error, createEntry, updateEntry, deleteEntry } = useGuestbook();

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      {/* 헤더 */}
      <Box sx={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        py: { xs: 2.5, md: 3 },
      }}>
        <Container maxWidth='lg'>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
            <Button
              component={Link}
              to='/'
              startIcon={<ArrowBackIcon sx={{ fontSize: 18 }} />}
              size='small'
              sx={{
                textTransform: 'none',
                fontSize: 13,
                color: '#5B9EC9',
                borderRadius: '8px',
                px: 1.5,
                '&:hover': { backgroundColor: '#EEF7FC' },
              }}
            >
              파일 허브
            </Button>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <BookIcon sx={{ fontSize: { xs: 22, md: 28 }, color: '#A8D8EE' }} />
            <Typography sx={{
              fontSize: { xs: '1.4rem', md: '1.75rem' },
              fontWeight: 800,
              color: '#1D3557',
              letterSpacing: '-0.5px',
            }}>
              방명록
            </Typography>
            {!loading && (
              <Typography sx={{ fontSize: 14, color: '#94A3B8', mt: 0.3 }}>
                {entries.length}개
              </Typography>
            )}
          </Box>
          <Typography sx={{ fontSize: 14, color: 'text.secondary', mt: 0.5 }}>
            방문해 주셔서 감사합니다. 자유롭게 메시지를 남겨주세요.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth='lg' sx={{ py: { xs: 3, md: 4 } }}>
        {/* 작성 폼 */}
        <GuestbookForm onSubmit={createEntry} />

        {/* 에러 */}
        {error && <Alert severity='error' sx={{ mb: 2, fontSize: 13 }}>{error}</Alert>}

        {/* 로딩 */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress sx={{ color: '#A8D8EE' }} />
          </Box>
        )}

        {/* 빈 상태 */}
        {!loading && entries.length === 0 && (
          <Box sx={{
            textAlign: 'center',
            py: 8,
            color: 'text.secondary',
          }}>
            <BookIcon sx={{ fontSize: 48, color: '#D0EFF8', mb: 2 }} />
            <Typography sx={{ fontSize: 15, fontWeight: 500 }}>
              아직 방명록이 없습니다.
            </Typography>
            <Typography sx={{ fontSize: 13, mt: 0.5 }}>
              첫 번째 방문자가 되어 메시지를 남겨보세요!
            </Typography>
          </Box>
        )}

        {/* 방명록 목록 */}
        {!loading && entries.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {entries.map((entry) => (
              <GuestbookEntry
                key={entry.id}
                entry={entry}
                onUpdate={updateEntry}
                onDelete={deleteEntry}
              />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default GuestbookPage;
