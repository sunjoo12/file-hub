import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Supabase DB에서 파일 목록을 조회하는 커스텀 훅
 * @returns {{ files, loading, error, refetch }}
 */
export function useFiles() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('files')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setFiles(data || []);
    } catch (err) {
      setError(err.message || '파일 목록을 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  return { files, loading, error, refetch: fetchFiles };
}
