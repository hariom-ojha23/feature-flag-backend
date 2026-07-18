import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Tenant } from './entities/tenant.entity'
import { Repository } from 'typeorm'

@Injectable()
export class TenantsService {
  constructor(@InjectRepository(Tenant) private readonly tenantRepo: Repository<Tenant>) {}

  async addTenant(name: string) {
    return this.tenantRepo.save({ name })
  }

  async getTenantById(tenantId: string) {
    return this.tenantRepo.findOneBy({ id: tenantId })
  }
}
