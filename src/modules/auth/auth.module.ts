import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UsersModule } from '../users/users.module'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { TenantsModule } from '../tenants/tenants.module'
import { PasswordService } from './services/password.service'
import { TokenService } from './services/token.service'

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtService, PasswordService, TokenService],
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
    UsersModule,
    TenantsModule,
  ],
})
export class AuthModule {}
