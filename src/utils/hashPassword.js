/**
 * Web Crypto API를 사용해 문자열을 SHA-256으로 해싱한다.
 * 평문 비밀번호는 DB에 저장되지 않는다.
 * @param {string} password
 * @returns {Promise<string>} 16진수 해시 문자열
 */
export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
