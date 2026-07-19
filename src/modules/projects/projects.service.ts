import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Project } from './entities/project.entity'
import { Repository } from 'typeorm'
import { CreateProjectDto } from './dto/project.dto'
import { KeyGeneratorService } from '../../common/services/key-generator.service'
import { isUniqueViolation } from '../../common/utils/unique-violation'

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    private readonly keyGenerator: KeyGeneratorService,
  ) {}

  async addProject(body: CreateProjectDto, tenantId: string, userId: string): Promise<Project> {
    const key = await this.keyGenerator.generateUniqueKey(body.name, {
      entity: Project,
      where: { tenant: { id: tenantId } },
    })

    let payload = {
      ...body,
      key,
      tenant: { id: tenantId },
      createdBy: { id: userId },
    }

    try {
      const project = this.projectRepo.create(payload)
      return await this.projectRepo.save(project)
    } catch (error) {
      if (isUniqueViolation(error)) {
        const retryKey = await this.keyGenerator.generateUniqueKey(
          body.name,
          { entity: Project, where: { tenant: { id: tenantId } } },
          { forceIncrement: true },
        )

        return await this.projectRepo.save({ ...payload, key: retryKey })
      }

      throw error
    }
  }

  async previewProjectKey(name: string, tenantId: string): Promise<{ key: string }> {
    const key = await this.keyGenerator.generateUniqueKey(name, {
      entity: Project,
      where: { tenant: { id: tenantId } },
    })

    return { key }
  }

  async getAllProjectsForSession(tenantId: string): Promise<Partial<Project>[]> {
    return this.projectRepo.find({
      where: { tenant: { id: tenantId } },
      select: { id: true, name: true, key: true },
    })
  }

  async getProjectForSession(projectId: string, tenantId: string): Promise<Project | null> {
    return this.projectRepo.findOneBy({ id: projectId, tenant: { id: tenantId } })
  }
}
