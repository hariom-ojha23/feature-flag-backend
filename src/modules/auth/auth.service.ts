import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { LoginDto, RegisterDto } from './dto/auth.dto'
import { UsersService } from '../users/users.service'
import { User } from '../users/entities/user.entity'
import { TenantsService } from '../tenants/tenants.service'
import { TokenService } from './services/token.service'
import { PasswordService } from './services/password.service'
import { UserRole, UserStatus } from '../../common/enums/user.enum'
import { TokenPayload } from '../../common/interfaces/token.interface'
import { NotificationService } from '../notification/notification.service'
import { OtpService } from '../otp/otp.service'
import { MailTemplateService } from '../mail/services/mail-template.service'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
    private readonly tenantService: TenantsService,
    private readonly tokenService: TokenService,
    private readonly passwordService: PasswordService,
    private readonly otpService: OtpService,
    private readonly notificationService: NotificationService,
    private readonly mailTemplateService: MailTemplateService,
  ) {}

  private getTokenPayload(user: User) {
    return {
      userId: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenant?.id,
    }
  }

  private async generateAuthTokens(user: User) {
    // generate tokens
    const payload: TokenPayload = this.getTokenPayload(user)

    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.generateAccessToken(payload),
      this.tokenService.generateRefreshToken(payload),
    ])

    // update token in user
    await this.userService.updateRefreshToken(user.id, refreshToken)

    return accessToken
  }

  private getVerifyEmailHtml(code: string) {
    return this.mailTemplateService.render('otp-verification', {
      APP_NAME: this.configService.get<string>('APP_NAME') ?? 'Featurix',
      OTP_CODE: code,
      CURRENT_YEAR: new Date().getFullYear().toString(),
    })
  }

  private async sendEmailVerifyCode(user: User) {
    const code = await this.otpService.generate(user.email)
    const htmlContent = this.getVerifyEmailHtml(code)

    await this.notificationService.sendMail({
      to: [{ email: user.email, name: user.fullName }],
      subject: 'Verify your email',
      htmlContent: htmlContent,
    })
  }

  async login(payload: LoginDto) {
    const { email, password } = payload
    if (!email || !password) {
      throw new UnauthorizedException('Invalid credentials')
    }

    // verify user
    const user = await this.userService.getUserByEmail(email)
    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    // user is not active
    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('User is not active')
    }

    // verify password
    const valid = await this.passwordService.verify(user.password, password)
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    // if email not verified, send otp
    if (!user.isEmailVerified) {
      await this.sendEmailVerifyCode(user)
    }

    // generate tokens
    const accessToken = await this.generateAuthTokens(user)

    // return response
    return { token: accessToken }
  }

  async register(payload: RegisterDto) {
    const { fullName, email, password, tenantName } = payload

    // verify user
    const user = await this.userService.checkEmailExist(payload.email)
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

    // send email verification code & generate tokens
    const [_, accessToken] = await Promise.all([
      this.sendEmailVerifyCode(savedUser),
      this.generateAuthTokens({ ...savedUser, tenant }),
    ])

    // return response
    return { token: accessToken }
  }

  async logout(userId: string) {
    return this.userService.updateRefreshToken(userId, null)
  }

  async getSessionData(userId: string, tenantId: string) {
    const [user, tenant] = await Promise.all([
      this.userService.getUserById(userId),
      this.tenantService.getTenantById(tenantId),
    ])

    return { user, tenant, project: null, availableProjects: [] }
  }

  async resendEmailVerifyCode(userId: string) {
    const user = await this.userService.getUserById(userId)
    if (!user) {
      throw new NotFoundException('User not found')
    }

    // user is not active
    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('User is not active')
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email is already verified')
    }

    await this.sendEmailVerifyCode(user)

    return { success: true, message: 'Email sent successfully' }
  }

  async verifyEmail(otp: string, userId: string) {
    const user = await this.userService.getUserById(userId)
    if (!user) {
      throw new NotFoundException('User not found')
    }

    // user is not active
    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('User is not active')
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email already verified')
    }

    await this.otpService.verify({ code: otp, email: user.email })

    user.isEmailVerified = true
    await this.userService.updateEmailVerifyFlag(user)
    return { success: true, message: 'Email verified successfully' }
  }
}
