import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto, RegisterDto } from './dto/auth.dto'
import { Public } from '../../common/decorators/public.decorator'
import type CustomRequest from '../../common/interfaces/request.interface'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body)
  }

  @Public()
  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body)
  }

  @Post('logout')
  async logout(@Req() req: CustomRequest) {
    return this.authService.logout(req.user.userId)
  }

  @Post('verify-email')
  async verifyEmail(@Body('otp') otp: string, @Req() req: CustomRequest) {
    return this.authService.verifyEmail(otp, req.user.userId)
  }

  @Post('verify-email/resend')
  async resendVerifyEmailCode(@Req() req: CustomRequest) {
    return this.authService.resendEmailVerifyCode(req.user.userId)
  }

  @Get('session')
  async getSessionData(@Query('projectId') projectId: string | undefined, @Req() req: CustomRequest) {
    const { userId, tenantId } = req.user
    return this.authService.getSessionData(userId, tenantId, projectId)
  }
}
