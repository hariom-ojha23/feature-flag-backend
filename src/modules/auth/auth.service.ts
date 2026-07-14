import { Injectable, UnauthorizedException } from '@nestjs/common'
import { LoginDto, RegisterDto } from './dto/auth.dto'
import { UsersService } from '../users/users.service'
import { User } from '../users/entities/user.entity'
import { TenantsService } from '../tenants/tenants.service'
import { TokenService } from './services/token.service'
import { PasswordService } from './services/password.service'
import { UserRole, UserStatus } from '../../common/enums/user.enum'
import { TokenPayload } from '../../common/interfaces/token.interface'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly tenantService: TenantsService,
    private readonly tokenService: TokenService,
    private readonly passwordService: PasswordService,
  ) {}

  private getTokenPayload(user: User) {
    return {
      userId: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenant?.id,
    }
  }

  private async getUserByEmail(email: string) {
    return this.userService.getUserByEmail(email)
  }

  private async generateAuthTokens(user: User) {
    // generate tokens
    const payload: TokenPayload = this.getTokenPayload(user)

    const [accessToken, refreshToken] = await Promise.all([
      await this.tokenService.generateAccessToken(payload),
      await this.tokenService.generateRefreshToken(payload),
    ])

    // update token in user
    await this.userService.updateRefreshToken(user.id, refreshToken)

    return accessToken
  }

  async login(payload: LoginDto) {
    const { email, password } = payload
    if (!email || !password) {
      throw new UnauthorizedException('Invalid credentials')
    }

    // verify user
    const user = await this.getUserByEmail(payload.email)
    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    // verify password
    const valid = await this.passwordService.verify(user.password, password)
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    // generate tokens
    const accessToken = await this.generateAuthTokens(user)

    // return response
    return { token: accessToken }
  }

  async register(payload: RegisterDto) {
    const { fullName, email, password, tenantName } = payload

    // verify user
    const user = await this.getUserByEmail(payload.email)
    if (user) {
      throw new UnauthorizedException('User with this email already exist')
    }

    // add tenant
    const tenant = await this.tenantService.addTenant(tenantName)

    // hash password before saving
    const hashedPassword = await this.passwordService.hash(password)

    // save user
    const savedUser = await this.userService.addUser({
      fullName,
      email,
      password: hashedPassword,
      role: UserRole.OWNER,
      status: UserStatus.ACTIVE,
      tenantId: tenant.id,
    })

    // generate tokens
    const accessToken = await this.generateAuthTokens({ ...savedUser, tenant })

    // return response
    return { token: accessToken }
  }

  async logout(userId: string) {
    return this.userService.updateRefreshToken(userId, null)
  }
}
