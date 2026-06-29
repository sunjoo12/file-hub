const DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'text/csv',
];

const ARCHIVE_TYPES = [
  'application/zip',
  'application/x-rar-compressed',
  'application/x-7z-compressed',
  'application/gzip',
  'application/x-tar',
  'application/x-bzip2',
  'application/x-bzip',
  'application/x-zip-compressed',
];

const CODE_TYPES = [
  'text/html',
  'text/css',
  'text/javascript',
  'application/javascript',
  'application/json',
  'application/xml',
  'text/xml',
  'text/x-python',
  'text/x-java-source',
  'application/typescript',
  'text/typescript',
];

/**
 * MIME 타입을 기준으로 파일 카테고리를 반환한다.
 * @param {string} mimeType - 파일 MIME 타입
 * @returns {string} - 'image' | 'document' | 'video' | 'archive' | 'code' | 'other'
 */
export function getCategory(mimeType) {
  if (!mimeType) return 'other';
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'other';
  if (DOCUMENT_TYPES.includes(mimeType)) return 'document';
  if (ARCHIVE_TYPES.includes(mimeType)) return 'archive';
  if (CODE_TYPES.includes(mimeType) || mimeType.startsWith('text/')) return 'code';
  return 'other';
}
