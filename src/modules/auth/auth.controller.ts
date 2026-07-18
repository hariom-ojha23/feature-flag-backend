import { Body, Controller, Get, Post, Req } from '@nestjs/common'
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
    try {
      return this.authService.login(body)
    } catch (error) {
      throw error
    }
  }

  @Public()
  @Post('register')
  async register(@Body() body: RegisterDto) {
    try {
      return this.authService.register(body)
    } catch (error) {
      throw error
    }
  }

  @Post('logout')
  async logout(@Req() req: CustomRequest) {
    try {
      return this.authService.logout(req.user.userId)
    } catch (error) {
      throw error
    }
  }

  @Get('session')
  async getSessionData(@Req() req: CustomRequest) {
    try {
      const { userId, tenantId } = req.user
      return this.authService.getSessionData(userId, tenantId)
    } catch (error) {
      throw error
    }
  }
}
