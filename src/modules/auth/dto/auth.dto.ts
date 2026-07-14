export class LoginDto {
  email!: string
  password!: string
}

export class RegisterDto extends LoginDto {
  fullName!: string
  tenantName!: string
}