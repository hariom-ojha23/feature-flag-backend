import { Injectable, UnauthorizedException } from '@nestjs/common'
import * as argon from 'argon2'

@Injectable()
export class PasswordService {
  async hash(password: string) {
    return argon.hash(password)
  }

  async verify(passwordHash: string, passwordText: string) {
    return argon.verify(passwordHash, passwordText)
  }
}
