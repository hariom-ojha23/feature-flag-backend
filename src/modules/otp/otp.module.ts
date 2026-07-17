import { Module } from '@nestjs/common'
import { OtpService } from './otp.service'
import { OtpController } from './otp.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Otp } from './entities/otp.entity'
import { PasswordService } from '../auth/services/password.service'

@Module({
  controllers: [OtpController],
  providers: [OtpService, PasswordService],
  imports: [TypeOrmModule.forFeature([Otp])],
  exports: [OtpService]
})
export class OtpModule {}
