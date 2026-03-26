import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

interface UseApiOptions {
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
}

export function useApi<T = any>(options: UseApiOptions = {}) {
  const { showErrorToast = true, showSuccessToast = false } = options;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(async (
    apiCall: Promise<T>,
    successMessage?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiCall;
      setData(result);
if (showSuccessToast && successMessage) {
        toast.success(successMessage);
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      if (showErrorToast) {
        toast.error(errorMessage);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showErrorToast, showSuccessToast]);

  return { loading, error, data, execute };
}
