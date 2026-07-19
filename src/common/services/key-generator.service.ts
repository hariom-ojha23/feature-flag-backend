import { Injectable } from '@nestjs/common'
import { DataSource, EntityTarget, ObjectLiteral } from 'typeorm'
import slugify from 'slugify'

interface KeyScope {
  entity: EntityTarget<ObjectLiteral>
  where: Record<string, any>
}

@Injectable({ scope: 0 })
export class KeyGeneratorService {
  constructor(private dataSource: DataSource) {}

  async generateUniqueKey(
    name: string,
    scope: KeyScope,
    options?: { forceIncrement: boolean }
  ): Promise<string> {
    const base = this.sluggifyName(name)
    const repo = this.dataSource.getRepository(scope.entity)

    let candidate = base;
    let suffix = options?.forceIncrement ? 2 : 1;

    while (await repo.exists({ where: { ...scope.where, key: candidate } })) {
      suffix++;
      candidate = `${base}-${suffix}`
    }

    return candidate
  }

  private sluggifyName(name: string) {
    return slugify(name, { lower: true, strict: true })
  }
}
