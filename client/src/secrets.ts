// https://vite.dev/guide/env-and-mode.html
function normalizeEndpoint(value: string) {
  return value.replace(/\/+$/, '');
}

function getDefaultBackendEndpoint() {
  const isViteDevServer = import.meta.env.DEV && typeof window !== 'undefined' && window.location.port === '5173';

  // Use the Vite proxy only when the app is actually running on the dev server.
  // In non-dev builds, require an explicit VITE_BACKEND_ENDPOINT from the hosting platform.
  return isViteDevServer ? '' : '';
}

export const secrets = {
  backendEndpoint: normalizeEndpoint((import.meta.env.VITE_BACKEND_ENDPOINT || getDefaultBackendEndpoint()).trim()),
};
