import { UserRole } from "../entities/user.entity"

export class AddUserDto {
  fullName!: string
  email!: string
  password!: string
  role!: UserRole
  tenantId!: string
}
