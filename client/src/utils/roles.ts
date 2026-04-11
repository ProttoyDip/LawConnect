export const userRoles = [
  'citizen',
  'police',
  'investigator',
  'officer',
  'admin',
  'super_admin',
] as const;

export type UserRole = (typeof userRoles)[number];

export function isUserRole(role: unknown): role is UserRole {
  return typeof role === 'string' && (userRoles as readonly string[]).includes(role);
}

export function isAdminRole(role?: UserRole | null): boolean {
  return role === 'admin' || role === 'super_admin';
}

export function isPoliceRole(role?: UserRole | null): boolean {
  return role === 'police' || role === 'officer' || role === 'investigator';
}

export function getRoleHomePath(role?: UserRole | null): string {
  if (isAdminRole(role)) {
    return '/admin';
  }

  if (isPoliceRole(role)) {
    return '/police';
  }

  return '/dashboard';
}