export enum UserRole {
  OWNER = 'owner', // created the tenant, full access
  ADMIN = 'admin', // manage users, flags, environments
  EDITOR = 'editor', // create/edit flags, can't manage users/billing
  VIEWER = 'viewer', // read-only, dashboards only
}

export enum UserStatus {
  ACTIVE = 'active',
  INVITED = 'invited', // invited to join, but not accepted yet
  SUSPENDED = 'suspended',
}
