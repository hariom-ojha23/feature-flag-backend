import { Module } from '@nestjs/common'
import { NotificationService } from './notification.service'
import { NotificationController } from './notification.controller'
import { MailModule } from '../mail/mail.module'

@Module({
  controllers: [NotificationController],
  providers: [NotificationService],
  imports: [MailModule],
  exports: [NotificationService],
})
export class NotificationModule {}
