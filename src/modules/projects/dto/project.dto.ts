import { ProjectStatus } from '../../../common/enums/project.enum'

export class CreateProjectDto {
  name!: string
  key!: string
  description?: string
  status!: ProjectStatus
}
