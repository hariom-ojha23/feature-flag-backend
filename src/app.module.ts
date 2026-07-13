import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { TenantsModule } from './modules/tenants/tenants.module'
import { dataSourceOptions } from './database/datasource'

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), AuthModule, UsersModule, TenantsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
