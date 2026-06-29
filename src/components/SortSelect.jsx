import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const SORT_OPTIONS = [
  { value: 'newest', label: '최신순' },
  { value: 'oldest', label: '오래된순' },
  { value: 'name_asc', label: '파일명순' },
  { value: 'size_desc', label: '크기 큰순' },
  { value: 'size_asc', label: '크기 작은순' },
];

/**
 * SortSelect 컴포넌트
 *
 * Props:
 * @param {string} value - 현재 정렬 기준 [Required]
 * @param {function} onChange - 정렬 변경 핸들러 [Required]
 *
 * Example usage:
 * <SortSelect value={sortBy} onChange={setSortBy} />
 */
function SortSelect({ value, onChange }) {
  return (
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      size='small'
      sx={{
        fontSize: 14,
        height: 40,
        minWidth: 120,
        backgroundColor: '#F1F5F9',
        '.MuiOutlinedInput-notchedOutline': { border: 'none' },
        '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
      }}
    >
      {SORT_OPTIONS.map((opt) => (
        <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: 14 }}>
          {opt.label}
        </MenuItem>
      ))}
    </Select>
  );
}

export default SortSelect;
