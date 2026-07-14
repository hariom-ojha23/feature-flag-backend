import { UserRole } from '../enums/user.enum'

export interface TokenPayload {
  userId: string
  email: string
  role: UserRole
  tenantId: string
}
