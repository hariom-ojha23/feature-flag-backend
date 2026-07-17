import { Module } from '@nestjs/common'
import { MailService } from './services/mail.service'
import { BrevoProvider } from './providers/brevo.provider'
import { MailTemplateService } from './services/mail-template.service'
import { ConfigModule } from '@nestjs/config'

@Module({
  controllers: [],
  providers: [MailService, BrevoProvider, MailTemplateService],
  exports: [MailService, MailTemplateService],
  imports: [ConfigModule]
})
export class MailModule {}
