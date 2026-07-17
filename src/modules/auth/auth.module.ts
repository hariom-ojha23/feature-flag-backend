import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UsersModule } from '../users/users.module'
import { JwtModule } from '@nestjs/jwt'
import { TenantsModule } from '../tenants/tenants.module'
import { PasswordService } from './services/password.service'
import { TokenService } from './services/token.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { OtpModule } from '../otp/otp.module'
import { NotificationModule } from '../notification/notification.module'
import { MailModule } from '../mail/mail.module'

@Module({
  controllers: [AuthController],
  providers: [AuthService, PasswordService, TokenService],
  imports: [
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          global: true,
          secret: config.get<string>('JWT_ACCESS_SECRET'),
          signOptions: { expiresIn: '15m' },
        }
      },
    }),
    UsersModule,
    TenantsModule,
    OtpModule,
    MailModule,
    NotificationModule,
  ],
})
export class AuthModule {}
