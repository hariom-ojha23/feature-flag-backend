import { UserRole, UserStatus } from '../../../common/enums/user.enum'

export class AddUserDto {
  fullName!: string
  email!: string
  password!: string
  role!: UserRole
  status!: UserStatus
  tenantId!: string
}
