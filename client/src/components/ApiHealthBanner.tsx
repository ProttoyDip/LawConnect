import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, XCircle } from 'lucide-react';
import { secrets } from '../secrets';

type BannerState = {
  visible: boolean;
  tone: 'warning' | 'error';
  text: string;
};

function getHealthUrl(baseUrl: string) {
  return `${baseUrl.replace(/\/$/, '')}/api/health`;
}

export default function ApiHealthBanner() {
  const [state, setState] = useState<BannerState>({
    visible: false,
    tone: 'warning',
    text: '',
  });

  const isProduction = import.meta.env.PROD;
  const healthUrl = useMemo(() => {
    if (!secrets.backendEndpoint) {
      return null;
    }
    return getHealthUrl(secrets.backendEndpoint);
  }, []);

  useEffect(() => {
    if (!isProduction) {
      return;
    }

    if (secrets.requiresConfiguration) {
      setState({
        visible: true,
        tone: 'error',
        text:
          secrets.warning ||
          'Backend API URL is missing. Set VITE_BACKEND_ENDPOINT in your frontend deployment environment.',
      });
      return;
    }

    if (!healthUrl) {
      return;
    }

    let canceled = false;

    const checkHealth = async () => {
      try {
        const response = await fetch(healthUrl, {
          method: 'GET',
          headers: { Accept: 'application/json' },
        });

        if (!response.ok) {
          throw new Error(`Health check failed (${response.status})`);
        }

        if (!canceled) {
          setState((prev) => ({ ...prev, visible: false }));
        }
      } catch (error) {
        if (canceled) {
          return;
        }

        const message = error instanceof Error ? error.message : 'Unknown API health check error';
        setState({
          visible: true,
          tone: 'warning',
          text: `API health check warning: ${message}. Target: ${healthUrl}`,
        });
      }
    };

    void checkHealth();

    return () => {
      canceled = true;
    };
  }, [healthUrl, isProduction]);

  if (!state.visible) {
    return null;
  }

  const isError = state.tone === 'error';

  return (
    <div
      className={`px-4 py-3 text-sm border-b ${
        isError
          ? 'bg-red-100 border-red-300 text-red-800 dark:bg-red-900/40 dark:border-red-700 dark:text-red-200'
          : 'bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-900/40 dark:border-amber-700 dark:text-amber-100'
      }`}
      role="alert"
    >
      <div className="max-w-7xl mx-auto flex items-start gap-2">
        {isError ? <XCircle className="h-4 w-4 mt-0.5 shrink-0" /> : <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />}
        <span>{state.text}</span>
      </div>
    </div>
  );
}