// https://vite.dev/guide/env-and-mode.html
export const secrets = {
  // Always use Vite proxy in development to avoid browser CORS/preflight issues.
  backendEndpoint: import.meta.env.DEV ? '' : (import.meta.env.VITE_BACKEND_ENDPOINT || ''),
};
