import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from '../../../common/entities/base.entity'
import { Exclude } from 'class-transformer'
import { Tenant } from '../../tenants/entities/tenant.entity'
import { UserRole, UserStatus } from '../../../common/enums/user.enum'

@Entity()
export class User extends BaseEntity {
  @ManyToOne(() => Tenant, (tenant) => tenant.users, {
    cascade: true,
  })
  tenant!: Tenant

  @Column()
  fullName!: string

  @Column({ unique: true })
  email!: string

  @Column({ select: false })
  @Exclude()
  password!: string

  @Column({ nullable: true, type: 'longtext' })
  avatarUrl?: string | null

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.VIEWER,
  })
  role!: UserRole

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.INVITED,
  })
  status!: UserStatus

  @Column({ nullable: true, type: 'timestamp' })
  lastLoginAt?: Date | null

  @Column({ default: false })
  isEmailVerified!: boolean

  @Column({ nullable: true, type: 'timestamp' })
  invitedAt?: Date | null

  @Column({ nullable: true })
  invitedBy?: string

  @Column({ nullable: true, type: 'longtext' })
  refreshToken?: string | null
}
