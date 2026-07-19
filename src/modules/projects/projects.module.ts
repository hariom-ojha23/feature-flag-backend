import { Module } from '@nestjs/common'
import { ProjectsService } from './projects.service'
import { ProjectsController } from './projects.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Project } from './entities/project.entity'
import { KeyGeneratorService } from '../../common/services/key-generator.service'

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, KeyGeneratorService],
  imports: [TypeOrmModule.forFeature([Project])],
})
export class ProjectsModule {}
