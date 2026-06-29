import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

/**
 * SearchBar 컴포넌트
 *
 * Props:
 * @param {string} value - 검색어 [Required]
 * @param {function} onChange - 검색어 변경 핸들러 [Required]
 *
 * Example usage:
 * <SearchBar value={search} onChange={setSearch} />
 */
function SearchBar({ value, onChange }) {
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      backgroundColor: '#F1F5F9',
      borderRadius: '8px',
      px: 1.5,
      height: 40,
      flex: 1,
      maxWidth: 360,
      border: '1px solid transparent',
      transition: 'border-color 0.2s',
      '&:focus-within': { borderColor: 'primary.main', backgroundColor: '#FFFFFF' },
    }}>
      <SearchIcon sx={{ fontSize: 18, color: 'text.secondary', flexShrink: 0 }} />
      <InputBase
        placeholder='파일명으로 검색...'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        sx={{ fontSize: 14, flex: 1, color: 'text.primary' }}
      />
      {value && (
        <IconButton size='small' onClick={() => onChange('')} sx={{ p: 0.3 }}>
          <CloseIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
        </IconButton>
      )}
    </Box>
  );
}

export default SearchBar;
