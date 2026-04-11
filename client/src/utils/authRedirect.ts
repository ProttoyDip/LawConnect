import type { NavigateFunction } from 'react-router-dom';
import ApiClient, { type User } from '../api';
import { getRoleHomePath } from './roles';

const apiClient = new ApiClient();
let redirectCheckPromise: Promise<boolean> | null = null;
let lastValidatedToken: string | null = null;
let lastValidatedAt = 0;
const REDIRECT_CHECK_TTL_MS = 15000;

function clearStaleAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export async function redirectAuthenticatedUser(navigate: NavigateFunction): Promise<boolean> {
  const token = localStorage.getItem('token');
  const rawUser = localStorage.getItem('user');

  if (!token && !rawUser) {
    return false;
  }

  if (!token || !rawUser) {
    clearStaleAuth();
    return false;
  }

  try {
    JSON.parse(rawUser);
  } catch {
    clearStaleAuth();
    return false;
  }

  try {
    const now = Date.now();
    if (
      lastValidatedToken === token &&
      now - lastValidatedAt < REDIRECT_CHECK_TTL_MS &&
      localStorage.getItem('user')
    ) {
      const cachedUser = JSON.parse(localStorage.getItem('user') as string) as User;
      navigate(getRoleHomePath(cachedUser.role), { replace: true });
      return true;
    }

    if (!redirectCheckPromise) {
      redirectCheckPromise = apiClient
        .getMe()
        .then((user) => {
          localStorage.setItem('user', JSON.stringify(user));
          lastValidatedToken = token;
          lastValidatedAt = Date.now();
          return user;
        })
        .finally(() => {
          redirectCheckPromise = null;
        })
        .then((user) => {
          navigate(getRoleHomePath(user.role), { replace: true });
          return true;
        });
    }

    return await redirectCheckPromise;
  } catch {
    clearStaleAuth();
    return false;
  }
}
