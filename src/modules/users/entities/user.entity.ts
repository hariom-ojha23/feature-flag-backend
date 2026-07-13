import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from '../../../common/entities/base.entity'
import { Exclude } from 'class-transformer'
import { Tenant } from '../../tenants/entities/tenant.entity'

export enum UserRole {
  OWNER = 'owner', // created the tenant, full access
  ADMIN = 'admin', // manage users, flags, environments
  EDITOR = 'editor', // create/edit flags, can't manage users/billing
  VIEWER = 'viewer', // read-only, dashboards only
}

export enum UserStatus {
  ACTIVE = 'active',
  INVITED = 'invited', // invited to join, but not accepted yet
  SUSPENDED = 'suspended',
}

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

  @Column()
  @Exclude()
  password!: string

  @Column({ nullable: true, type: 'longtext' })
  avatarUrl?: string

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
  lastLoginAt?: Date

  @Column({ default: false })
  isEmailVerified?: boolean

  @Column({ nullable: true, type: 'timestamp' })
  invitedAt?: Date

  @Column({ nullable: true })
  invitedBy?: string

  @Column({ nullable: true, type: 'longtext' })
  refreshToken?: string
}
