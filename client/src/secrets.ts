// https://vite.dev/guide/env-and-mode.html
export const secrets = {
  // Empty base URL lets Vite dev proxy handle /api requests when env is not set.
  backendEndpoint: import.meta.env.VITE_BACKEND_ENDPOINT || '',
};
