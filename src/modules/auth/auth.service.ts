import { Injectable, UnauthorizedException } from '@nestjs/common'
import { LoginDto, RegisterDto } from './dto/auth.dto'
import { UsersService } from '../users/users.service'
import { User, UserRole } from '../users/entities/user.entity'
import { TenantsService } from '../tenants/tenants.service'
import { TokenService } from './services/token.service'
import { PasswordService } from './services/password.service'

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
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      tenant: { id: user.tenant?.id, name: user.tenant?.name },
    }
  }

  private async getUserByEmail(email: string) {
    return this.userService.getUserByEmail(email)
  }

  private async getAccessAndRefreshToken(user: User) {
    // generate tokens
    const payload = this.getTokenPayload(user)

    const [accessToken, refreshToken] = await Promise.all([
      await this.tokenService.generateAccessToken(payload),
      await this.tokenService.generateRefreshToken(payload),
    ])

    // update token in user
    await this.userService.updateRefreshToken(user.id, refreshToken)

    return { accessToken, refreshToken }
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
    const tokens = await this.getAccessAndRefreshToken(user)

    // return response
    return tokens
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
      tenantId: tenant.id,
    })

    // generate tokens
    const tokens = await this.getAccessAndRefreshToken({ ...savedUser, tenant })

    // return response
    return tokens
  }
}
