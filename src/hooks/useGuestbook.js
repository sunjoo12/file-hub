import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { hashPassword } from '../utils/hashPassword';

/**
 * 방명록 CRUD 커스텀 훅
 * - SELECT 시 password_hash 컬럼은 제외하여 조회
 * - 수정/삭제 전 비밀번호를 SHA-256 해시로 검증
 * @returns {{ entries, loading, error, createEntry, updateEntry, deleteEntry, refetch }}
 */
export function useGuestbook() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEntries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('guestbook')
        .select('id, author, content, created_at, updated_at')
        .order('created_at', { ascending: false });
      if (fetchError) throw fetchError;
      setEntries(data || []);
    } catch (err) {
      setError(err.message || '방명록을 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  const createEntry = useCallback(async ({ author, content, password }) => {
    const hash = await hashPassword(password);
    const { error: insertError } = await supabase.from('guestbook').insert({
      author,
      content,
      password_hash: hash,
    });
    if (insertError) throw insertError;
    await fetchEntries();
  }, [fetchEntries]);

  const verifyPassword = useCallback(async (entryId, password) => {
    const hash = await hashPassword(password);
    const { data, error: fetchError } = await supabase
      .from('guestbook')
      .select('password_hash')
      .eq('id', entryId)
      .single();
    if (fetchError) throw fetchError;
    return data.password_hash === hash;
  }, []);

  const updateEntry = useCallback(async (entryId, { content, password }) => {
    const isValid = await verifyPassword(entryId, password);
    if (!isValid) throw new Error('비밀번호가 일치하지 않습니다.');
    const { error: updateError } = await supabase
      .from('guestbook')
      .update({ content, updated_at: new Date().toISOString() })
      .eq('id', entryId);
    if (updateError) throw updateError;
    await fetchEntries();
  }, [verifyPassword, fetchEntries]);

  const deleteEntry = useCallback(async (entryId, password) => {
    const isValid = await verifyPassword(entryId, password);
    if (!isValid) throw new Error('비밀번호가 일치하지 않습니다.');
    const { error: deleteError } = await supabase
      .from('guestbook')
      .delete()
      .eq('id', entryId);
    if (deleteError) throw deleteError;
    await fetchEntries();
  }, [verifyPassword, fetchEntries]);

  return { entries, loading, error, createEntry, updateEntry, deleteEntry, refetch: fetchEntries };
}
