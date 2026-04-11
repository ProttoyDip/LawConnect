// https://vite.dev/guide/env-and-mode.html
function normalizeEndpoint(value: string) {
  return value.replace(/\/+$/, '');
}

function getDefaultBackendEndpoint() {
  const isViteDevServer = import.meta.env.DEV && typeof window !== 'undefined' && window.location.port === '5173';

  if (isViteDevServer) {
    // Use Vite proxy in local dev.
    return '';
  }

  // Safety fallback for production builds when hosting env vars are missing.
  return 'https://lawconnect-zccz.onrender.com';
}

export const secrets = {
  backendEndpoint: normalizeEndpoint((import.meta.env.VITE_BACKEND_ENDPOINT || getDefaultBackendEndpoint()).trim()),
};
