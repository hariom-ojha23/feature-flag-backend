import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Otp } from './entities/otp.entity'
import { Repository } from 'typeorm'
import { randomInt } from 'crypto'
import { PasswordService } from '../auth/services/password.service'
import { VerifyOtpDto } from './dto/otp.dto'

const OTP_TTL_MS = 5 * 60 * 1000
const MAX_ATTEMPTS = 3

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Otp)
    private readonly otpRepo: Repository<Otp>,
    private passwordService: PasswordService,
  ) {}

  async generate(email: string): Promise<string> {
    // invalidate any previous unused otp for this email
    await this.otpRepo.update({ email, isUsed: false }, { isUsed: true })

    const code = randomInt(100000, 999999).toString()
    const otp = this.otpRepo.create({
      code: await this.passwordService.hash(code),
      email: email,
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
      isUsed: false,
      attemptCount: 0,
    })

    await this.otpRepo.save(otp)
    return code
  }

  async verify(payload: VerifyOtpDto): Promise<void> {
    const { code, email } = payload

    // get latest unused otp using email
    const otp = await this.otpRepo.findOne({
      where: { email, isUsed: false },
      order: { createdAt: 'DESC' },
    })

    if (!otp) throw new BadRequestException('No active OTP found. Please request a new one.')

    if (otp.expiresAt < new Date()) {
      throw new BadRequestException('OTP expired. Please request a new one.')
    }

    if (otp.attemptCount >= MAX_ATTEMPTS) {
      otp.isUsed = true
      await this.otpRepo.save(otp)
      throw new BadRequestException('Maximum attempts exceeded. Please request a new OTP.')
    }

    if (!(await this.passwordService.verify(otp.code, code))) {
      otp.attemptCount += 1
      await this.otpRepo.save(otp)
      const remaining = MAX_ATTEMPTS - otp.attemptCount
      throw new BadRequestException(
        remaining > 0
          ? `Invalid OTP. ${remaining} attempt(s) left.`
          : 'Invalid OTP. Maximum attempts exceeded.',
      )
    }

    // mark otp as used if valid
    otp.isUsed = true
    await this.otpRepo.save(otp)
  }
}
