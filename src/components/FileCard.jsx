import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Checkbox from '@mui/material/Checkbox';
import ImageIcon from '@mui/icons-material/Image';
import DescriptionIcon from '@mui/icons-material/Description';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import CodeIcon from '@mui/icons-material/Code';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import { supabase } from '../lib/supabase';
import { formatBytes } from '../utils/formatBytes';

const CATEGORY_CONFIG = {
  image: { Icon: ImageIcon, color: '#3B82F6', label: '이미지' },
  document: { Icon: DescriptionIcon, color: '#10B981', label: '문서' },
  video: { Icon: VideoLibraryIcon, color: '#8B5CF6', label: '영상' },
  archive: { Icon: FolderZipIcon, color: '#F59E0B', label: '압축파일' },
  code: { Icon: CodeIcon, color: '#EF4444', label: '코드' },
  other: { Icon: InsertDriveFileIcon, color: '#6B7280', label: '기타' },
};

/**
 * FileCard 컴포넌트 — 개별 파일 정보 카드
 *
 * Props:
 * @param {object} file - 파일 메타데이터 객체 [Required]
 * @param {boolean} isSelected - 선택 여부 [Optional, 기본값: false]
 * @param {function} onSelect - 체크박스 변경 핸들러 (id, checked) => void [Optional]
 * @param {function} onDelete - 삭제 버튼 클릭 핸들러 () => void [Optional]
 *
 * Example usage:
 * <FileCard file={fileObject} isSelected={false} onSelect={handleSelect} onDelete={handleDelete} />
 */
function FileCard({ file, isSelected = false, onSelect, onDelete }) {
  const [downloading, setDownloading] = useState(false);
  const config = CATEGORY_CONFIG[file.category] || CATEGORY_CONFIG.other;
  const { Icon, color, label } = config;
  const date = new Date(file.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const { data, error } = await supabase.storage
        .from('file-storage')
        .download(file.storage_path);

      if (error) throw error;

      const blobUrl = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = file.original_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch (err) {
      alert(`다운로드 실패: ${err.message}`);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Box sx={{
      backgroundColor: isSelected ? '#EEF7FC' : '#FFFFFF',
      border: `1px solid ${isSelected ? '#A8D8EE' : '#E2E8F0'}`,
      borderRadius: '12px',
      p: { xs: 2, md: 2.5 },
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      transition: 'box-shadow 0.2s ease, border-color 0.2s ease, background-color 0.15s ease',
      '&:hover': {
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        borderColor: isSelected ? '#A8D8EE' : '#CBD5E1',
      },
    }}>
      {/* 체크박스 */}
      <Checkbox
        checked={isSelected}
        onChange={(e) => onSelect?.(file.id, e.target.checked)}
        onClick={(e) => e.stopPropagation()}
        size='small'
        sx={{
          flexShrink: 0,
          p: 0.5,
          color: '#CBD5E1',
          '&.Mui-checked': { color: '#5B9EC9' },
        }}
      />

      {/* 파일 유형 아이콘 */}
      <Box sx={{
        width: 48,
        height: 48,
        borderRadius: '10px',
        backgroundColor: `${color}18`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon sx={{ fontSize: 24, color }} />
      </Box>

      {/* 파일 정보 */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{
          fontSize: 14,
          fontWeight: 600,
          color: 'text.primary',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          mb: 0.5,
        }}>
          {file.original_name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label={label}
            size='small'
            sx={{
              fontSize: 11,
              height: 20,
              backgroundColor: `${color}18`,
              color,
              fontWeight: 600,
            }}
          />
          {file.extension && (
            <Typography sx={{ fontSize: 12, color: 'text.secondary', textTransform: 'uppercase', fontWeight: 500 }}>
              .{file.extension}
            </Typography>
          )}
          <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
            {formatBytes(file.size)}
          </Typography>
          <Typography sx={{ fontSize: 12, color: '#94A3B8', display: { xs: 'none', sm: 'block' } }}>
            {date}
          </Typography>
        </Box>
      </Box>

      {/* 액션 버튼 */}
      <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
        {/* 삭제 버튼 */}
        <Tooltip title={`${file.original_name} 삭제`} placement='top'>
          <IconButton
            onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
            size='small'
            sx={{
              color: '#EF4444',
              backgroundColor: '#FEF2F2',
              '&:hover': { backgroundColor: '#FEE2E2' },
              transition: 'background-color 0.2s',
            }}
          >
            <DeleteIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>

        {/* 다운로드 버튼 */}
        <Tooltip title={downloading ? '다운로드 중...' : `${file.original_name} 다운로드`} placement='top'>
          <span>
            <IconButton
              onClick={handleDownload}
              disabled={downloading}
              sx={{
                color: 'primary.main',
                backgroundColor: '#EFF6FF',
                flexShrink: 0,
                '&:hover': { backgroundColor: '#DBEAFE' },
                '&.Mui-disabled': { backgroundColor: '#F1F5F9' },
                transition: 'background-color 0.2s',
              }}
            >
              {downloading
                ? <CircularProgress size={20} thickness={4} sx={{ color: 'primary.main' }} />
                : <DownloadIcon sx={{ fontSize: 20 }} />
              }
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    </Box>
  );
}

export default FileCard;
