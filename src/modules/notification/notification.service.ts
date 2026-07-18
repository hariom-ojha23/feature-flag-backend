import { Injectable } from '@nestjs/common'
import { SendEmailOptions } from '../../common/interfaces/email-option.interface'
import { MailService } from '../mail/services/mail.service'

@Injectable()
export class NotificationService {
  constructor(private readonly mailService: MailService) {}

  async sendMail(options: SendEmailOptions) {
    return this.mailService.sendMail(options)
  }
}
