import type { User, UserRole } from '../features/auth/types';

export function mapBackendRoleToAppRole(rawRole: string | undefined | null): UserRole {
  if (!rawRole) return 'STUDENT';
  const clean = String(rawRole).replace(/^ROLE_/, '').toUpperCase();
  if (clean === 'INSTITUTION_ADMIN' || clean === 'PLATFORM_ADMIN' || clean === 'ADMIN') {
    return 'ADMIN';
  }
  if (clean === 'FACULTY' || clean === 'TEACHER') {
    return 'TEACHER';
  }
  if (clean === 'PARENT') {
    return 'PARENT';
  }
  return 'STUDENT';
}

export function parseJwtPayload(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonStr = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonStr);
  } catch (e) {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }
}

export function extractUserFromAuthResponse(
  response: any,
  fallbackEmail?: string
): User {
  let id = 1;
  let email = fallbackEmail || '';
  let firstName = '';
  let lastName = '';
  let rawRole: string | undefined = undefined;
  let role: UserRole = 'STUDENT';
  let active = true;
  let firstLogin = false;
  let institutionId: number | undefined = undefined;

  if (response?.firstLogin !== undefined) {
    firstLogin = Boolean(response.firstLogin);
  }

  // 1. Direct Backend LoginResponse { token, userId, email, roles, firstLogin }
  if (response?.userId) id = response.userId;
  if (response?.email) email = response.email;
  if (Array.isArray(response?.roles) && response.roles.length > 0) {
    rawRole = response.roles[0];
    role = mapBackendRoleToAppRole(rawRole);
  } else if (response?.role) {
    rawRole = response.role;
    role = mapBackendRoleToAppRole(rawRole);
  }

  // 2. If response has nested user object
  if (response?.user && typeof response.user === 'object') {
    const u = response.user;
    if (u.id) id = u.id;
    if (u.email) email = u.email;
    if (u.firstName) firstName = u.firstName;
    if (u.lastName) lastName = u.lastName;
    if (u.role) {
      rawRole = u.role;
      role = mapBackendRoleToAppRole(u.role);
    }
    if (u.active !== undefined) active = u.active;
    if (u.firstLogin !== undefined) firstLogin = u.firstLogin;
    if (u.institutionId) institutionId = u.institutionId;
  }

  // 3. Decode JWT payload if token exists to extract extra claims (sub, institutionId, names)
  const token = response?.token || response?.accessToken || (typeof response === 'string' ? response : null);
  if (token && typeof token === 'string' && token.includes('.')) {
    const jwtPayload = parseJwtPayload(token);
    if (jwtPayload) {
      if (!email && (jwtPayload.sub || jwtPayload.email || jwtPayload.username)) {
        email = jwtPayload.email || jwtPayload.sub || jwtPayload.username;
      }
      if (jwtPayload.id || jwtPayload.userId || jwtPayload.sub_id) {
        id = jwtPayload.id || jwtPayload.userId || jwtPayload.sub_id;
      }
      if (jwtPayload.institutionId) {
        institutionId = jwtPayload.institutionId;
      }
      if (!firstName && jwtPayload.firstName) firstName = jwtPayload.firstName;
      if (!lastName && jwtPayload.lastName) lastName = jwtPayload.lastName;
      if (!firstName && jwtPayload.name) {
        const parts = jwtPayload.name.trim().split(/\s+/);
        firstName = parts[0];
        lastName = parts.slice(1).join(' ');
      }
      if (!rawRole) {
        const jwtRole =
          jwtPayload.role ||
          (Array.isArray(jwtPayload.roles) ? jwtPayload.roles[0] : null) ||
          (Array.isArray(jwtPayload.authorities)
            ? typeof jwtPayload.authorities[0] === 'string'
              ? jwtPayload.authorities[0]
              : jwtPayload.authorities[0]?.authority
            : null);
        if (jwtRole) {
          rawRole = jwtRole;
          role = mapBackendRoleToAppRole(jwtRole);
        }
      }
      if (jwtPayload.firstLogin !== undefined) {
        firstLogin = Boolean(jwtPayload.firstLogin);
      }
    }
  }

  // 4. Fallback name split from email (e.g. admin@institution.edu -> Admin)
  if (!firstName && email) {
    const localPart = email.split('@')[0];
    const chunks = localPart.split(/[._-]/).filter(Boolean);
    if (chunks.length > 0) {
      firstName = chunks[0].charAt(0).toUpperCase() + chunks[0].slice(1);
      if (chunks.length > 1) {
        lastName = chunks.slice(1).map((c: string) => c.charAt(0).toUpperCase() + c.slice(1)).join(' ');
      }
    }
  }

  return {
    id,
    email: email || fallbackEmail || 'user@educonflux.com',
    firstName: firstName || (role === 'ADMIN' ? 'Administrator' : role === 'TEACHER' ? 'Faculty' : 'Student'),
    lastName: lastName || '',
    role,
    rawRole,
    active,
    firstLogin,
    institutionId,
  };
}
