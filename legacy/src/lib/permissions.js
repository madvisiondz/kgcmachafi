import { ROLES } from './roles-service';

export const PERMISSIONS = {
  MANAGE_NEWS: 'manage_news',
  MANAGE_LIBRARY: 'manage_library',
  MANAGE_PROGRAMS: 'manage_programs',
  VIEW_ADMIN: 'view_admin',
};

const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [PERMISSIONS.VIEW_ADMIN, PERMISSIONS.MANAGE_NEWS, PERMISSIONS.MANAGE_LIBRARY, PERMISSIONS.MANAGE_PROGRAMS],
  [ROLES.MANAGER]: [PERMISSIONS.VIEW_ADMIN, PERMISSIONS.MANAGE_NEWS, PERMISSIONS.MANAGE_LIBRARY, PERMISSIONS.MANAGE_PROGRAMS],
  [ROLES.NEWS_MANAGER]: [PERMISSIONS.VIEW_ADMIN, PERMISSIONS.MANAGE_NEWS],
  [ROLES.EDITOR]: [PERMISSIONS.VIEW_ADMIN, PERMISSIONS.MANAGE_NEWS], // Can add, usually restricted edit in full app, but simplified here
  [ROLES.SUPERVISOR]: [PERMISSIONS.VIEW_ADMIN, PERMISSIONS.MANAGE_PROGRAMS],
  [ROLES.CONSULTANT]: [PERMISSIONS.VIEW_ADMIN],
};

export const hasPermission = (userRole, permission) => {
  if (!userRole) return false;
  const permissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.includes(permission);
};

export const canAccessAdmin = (userRole) => {
  return hasPermission(userRole, PERMISSIONS.VIEW_ADMIN);
};