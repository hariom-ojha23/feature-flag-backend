import { Column, Entity, OneToMany } from 'typeorm'
import { BaseEntity } from '../../../common/entities/base.entity'
import { User } from '../../users/entities/user.entity'

export enum TenantStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
}

@Entity()
export class Tenant extends BaseEntity {
  @Column()
  name!: string

  @Column({ nullable: true })
  logoUrl?: string

  @Column({
    type: 'enum',
    enum: TenantStatus,
    default: TenantStatus.ACTIVE,
  })
  status!: TenantStatus

  @OneToMany(() => User, (u) => u.tenant)
  users!: User[]
}
