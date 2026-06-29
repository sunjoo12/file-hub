/**
 * 바이트 수를 사람이 읽기 좋은 형태로 변환한다.
 * @param {number} bytes - 파일 크기 (바이트)
 * @param {number} decimals - 소수점 자리수 [Optional, 기본값: 1]
 * @returns {string} - '1.2 MB' 형태의 문자열
 */
export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}
