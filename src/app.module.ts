import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { TenantsModule } from './modules/tenants/tenants.module'
import { dataSourceOptions } from './database/datasource'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './common/guards/jwt-auth.guard'
import { MailModule } from './modules/mail/mail.module'
import { OtpModule } from './modules/otp/otp.module'
import { NotificationModule } from './modules/notification/notification.module';
import { ProjectsModule } from './modules/projects/projects.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    TenantsModule,
    MailModule,
    OtpModule,
    NotificationModule,
    ProjectsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
