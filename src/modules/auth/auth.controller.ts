import { Body, Controller, Post, Req } from '@nestjs/common'
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
    return this.authService.logout(req.user.userId)
  }
}
