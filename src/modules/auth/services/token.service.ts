import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { TokenPayload } from '../../../common/interfaces/token.interface'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateAccessToken(payload: TokenPayload) {
    return this.jwtService.signAsync(payload)
  }

  async generateRefreshToken(payload: TokenPayload) {
    return this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    })
  }
}
