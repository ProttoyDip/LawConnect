// https://vite.dev/guide/env-and-mode.html
function normalizeEndpoint(value: string) {
  return value.replace(/\/+$/, '');
}

function isViteDevServer() {
  return import.meta.env.DEV && typeof window !== 'undefined' && window.location.port === '5173';
}

function getConfiguredBackendEndpoint() {
  const configured =
    (import.meta.env.VITE_BACKEND_ENDPOINT as string | undefined) ||
    (import.meta.env.VITE_API_URL as string | undefined) ||
    '';

  return normalizeEndpoint(configured.trim());
}

function resolveBackendConfig() {
  const configuredEndpoint = getConfiguredBackendEndpoint();
  const isDevProxyMode = isViteDevServer();

  if (configuredEndpoint) {
    return {
      backendEndpoint: configuredEndpoint,
      isConfigured: true,
      requiresConfiguration: false,
      warning: null as string | null,
    };
  }

  if (isDevProxyMode) {
    // Use Vite proxy in local dev when no explicit API URL is provided.
    return {
      backendEndpoint: '',
      isConfigured: true,
      requiresConfiguration: false,
      warning: null as string | null,
    };
  }

  return {
    backendEndpoint: '',
    isConfigured: false,
    requiresConfiguration: true,
    warning:
      'Missing VITE_BACKEND_ENDPOINT. Set it to your backend URL, e.g. https://my-backend.onrender.com',
  };
}

const backendConfig = resolveBackendConfig();

export const secrets = backendConfig;
