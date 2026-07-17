import { Injectable } from '@nestjs/common'
import { BrevoProvider } from '../providers/brevo.provider'
import { SendEmailOptions } from '../../../common/interfaces/email-option.interface'

@Injectable()
export class MailService {
  constructor(private readonly brevoProvider: BrevoProvider) {}

  async sendMail(options: SendEmailOptions) {
    return this.brevoProvider.send(options)
  }
}
