// https://vite.dev/guide/env-and-mode.html
function normalizeEndpoint(value: string) {
  return value.replace(/\/+$/, '');
}

function getDefaultBackendEndpoint() {
  const isViteDevServer = import.meta.env.DEV && typeof window !== 'undefined' && window.location.port === '5173';

  // Use the Vite proxy only when the app is actually running on the dev server.
  // In other local or packaged runtimes, fall back to the Laravel backend directly.
  return isViteDevServer ? '' : 'http://127.0.0.1:8000';
}

export const secrets = {
  backendEndpoint: normalizeEndpoint((import.meta.env.VITE_BACKEND_ENDPOINT || getDefaultBackendEndpoint()).trim()),
};
