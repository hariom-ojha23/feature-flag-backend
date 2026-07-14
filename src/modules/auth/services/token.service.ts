import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

export interface TokenPayload {
  id: string
  fullName: string
  email: string
  tenant: { id: string; name: string }
}

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  async generateAccessToken(payload: TokenPayload) {
    return this.jwtService.signAsync(payload)
  }

  async generateRefreshToken(payload: TokenPayload) {
    return this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_REFRESH_SECRET,
    })
  }
}
