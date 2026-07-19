import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common'
import { ProjectsService } from './projects.service'
import { CreateProjectDto } from './dto/project.dto'
import type CustomRequest from '../../common/interfaces/request.interface'
import { Project } from './entities/project.entity'

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async addProject(@Body() body: CreateProjectDto, @Req() req: CustomRequest): Promise<Project> {
    const { userId, tenantId } = req.user
    return this.projectsService.addProject(body, tenantId, userId)
  }

  @Get('preview-key')
  async previewProjectKey(@Query('name') name: string, @Req() req: CustomRequest): Promise<{ key: string }> {
    return this.projectsService.previewProjectKey(name, req.user.tenantId)
  }
}
