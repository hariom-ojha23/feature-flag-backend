import { Column, Entity, Index, ManyToOne, Unique } from 'typeorm'
import { BaseEntity } from '../../../common/entities/base.entity'
import { Tenant } from '../../tenants/entities/tenant.entity'
import { User } from '../../users/entities/user.entity'
import { ProjectStatus } from '../../../common/enums/project.enum'

@Entity()
@Unique(['tenant', 'key'])
export class Project extends BaseEntity {
  @Index()
  @ManyToOne(() => Tenant, (t) => t.id)
  tenant!: Tenant

  @Column()
  key!: string

  @Column()
  name!: string

  @Column({ nullable: true, type: 'longtext' })
  description?: string

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.ACTIVE,
  })
  status!: ProjectStatus

  @ManyToOne(() => User, (u) => u.id)
  createdBy!: User

  @ManyToOne(() => User, (u) => u.id)
  updatedBy!: User

  @Index()
  @Column({ nullable: true })
  archived_at?: Date
}
