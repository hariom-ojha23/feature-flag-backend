import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'
import { AddUserDto } from './dto/user.dto'

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) {}

  async addUser(payload: AddUserDto) {
    return await this.userRepo.save({
      ...payload,
      tenant: { id: payload.tenantId },
    })
  }

  async getUserByEmail(email: string) {
    return await this.userRepo.findOneBy({ email })
  }

  async updateRefreshToken(id: string, token: string | null) {
    let payload: Partial<User> = {
      refreshToken: token,
    }

    // if token is available (in case of login | register)
    if (token) {
      payload = {
        ...payload,
        lastLoginAt: new Date(),
      }
    }

    return this.userRepo.update(id, payload)
  }
}
