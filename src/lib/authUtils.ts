import type { User } from '../store/slices/authSlice';

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
  fallbackEmail?: string,
  fallbackRole?: string
): User {
  let id = 1;
  let email = fallbackEmail || '';
  let firstName = '';
  let lastName = '';
  let role: User['role'] = (fallbackRole as any) || 'STUDENT';
  let active = true;

  // 1. If backend returned a nested user object
  if (response?.user && typeof response.user === 'object') {
    const u = response.user;
    if (u.id) id = u.id;
    if (u.email) email = u.email;
    if (u.firstName) firstName = u.firstName;
    if (u.lastName) lastName = u.lastName;
    if (u.role) role = String(u.role).replace('ROLE_', '') as User['role'];
    if (u.active !== undefined) active = u.active;
  }

  // 2. If backend returned flat top-level fields
  if (response?.id) id = response.id;
  if (response?.email) email = response.email;
  if (response?.firstName) firstName = response.firstName;
  if (response?.lastName) lastName = response.lastName;
  if (response?.name && !firstName) {
    const parts = response.name.trim().split(/\s+/);
    firstName = parts[0];
    lastName = parts.slice(1).join(' ');
  }
  if (response?.role) {
    role = String(response.role).replace('ROLE_', '') as User['role'];
  } else if (Array.isArray(response?.roles) && response.roles.length > 0) {
    role = String(response.roles[0]).replace('ROLE_', '') as User['role'];
  }

  // 3. Decode JWT payload if token exists
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
      if (!firstName && jwtPayload.firstName) firstName = jwtPayload.firstName;
      if (!lastName && jwtPayload.lastName) lastName = jwtPayload.lastName;
      if (!firstName && jwtPayload.name) {
        const parts = jwtPayload.name.trim().split(/\s+/);
        firstName = parts[0];
        lastName = parts.slice(1).join(' ');
      }
      if (jwtPayload.role || jwtPayload.roles || jwtPayload.authorities) {
        const rawRole = jwtPayload.role || (Array.isArray(jwtPayload.roles) ? jwtPayload.roles[0] : (Array.isArray(jwtPayload.authorities) ? (typeof jwtPayload.authorities[0] === 'string' ? jwtPayload.authorities[0] : jwtPayload.authorities[0]?.authority) : null));
        if (rawRole) {
          role = String(rawRole).replace('ROLE_', '') as User['role'];
        }
      }
    }
  }

  // 4. Derive first and last name from email if still empty (e.g. "frank.xavio@educonflux.com" -> "Frank", "Xavio")
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
    email: email || fallbackEmail || 'student@institution.edu',
    firstName: firstName || 'Student',
    lastName: lastName || '',
    role,
    active
  };
}
