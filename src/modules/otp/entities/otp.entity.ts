import { Column, Entity } from 'typeorm'
import { BaseEntity } from '../../../common/entities/base.entity'

@Entity()
export class Otp extends BaseEntity {
  @Column()
  email!: string

  @Column()
  code!: string

  @Column()
  expiresAt!: Date

  @Column({ default: 0 })
  attemptCount!: number

  @Column({ default: false })
  isUsed!: boolean
}
