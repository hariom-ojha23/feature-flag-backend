import { Request } from 'express'
import { UserRole } from '../enums/user.enum'

export default interface CustomRequest extends Request {
  user: {
    userId: string
    email: string
    role: UserRole
    tenantId: string
  }
}
