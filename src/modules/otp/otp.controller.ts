import { Body, Controller, Post } from '@nestjs/common'
import { OtpService } from './otp.service'
import { VerifyOtpDto } from './dto/otp.dto'

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('verify')
  verifyOtp(@Body() body: VerifyOtpDto) {
    try {
      return this.otpService.verify(body)
    } catch (error) {
      throw error
    }
  }
}
