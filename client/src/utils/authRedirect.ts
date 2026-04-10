import axios from 'axios';
import type { NavigateFunction } from 'react-router-dom';
import { secrets } from '../secrets';
import type { User } from '../api';
import { getRoleHomePath } from './roles';

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
    const response = await axios.get<User>(`${secrets.backendEndpoint || ''}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    const user = response.data;
    localStorage.setItem('user', JSON.stringify(user));
    navigate(getRoleHomePath(user.role), { replace: true });
    return true;
  } catch {
    clearStaleAuth();
    return false;
  }
}
