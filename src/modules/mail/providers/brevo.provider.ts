import { Injectable } from '@nestjs/common'
import { Brevo, BrevoClient, BrevoError } from '@getbrevo/brevo'
import { ConfigService } from '@nestjs/config'
import { SendEmailOptions } from '../../../common/interfaces/email-option.interface'

@Injectable()
export class BrevoProvider {
  brevo!: BrevoClient

  constructor(private configService: ConfigService) {
    this.brevo = new BrevoClient({
      apiKey: this.configService.get<string>('BREVO_API_KEY') as string,
    })
  }

  async send(options: SendEmailOptions) {
    const request: Brevo.SendTransacEmailRequest = {
      to: options.to,
      subject: options.subject,
      htmlContent: options.htmlContent,
      textContent: options.textContent,
      sender: {
        name: this.configService.get<string>('BREVO_SENDER_NAME'),
        email: this.configService.get<string>('BREVO_SENDER_EMAIL'),
      },
    }

    try {
      const result = await this.brevo.transactionalEmails.sendTransacEmail(request)
      console.log(result)
    } catch (error: any) {
      if (error instanceof Brevo.UnauthorizedError) {
        console.error('Invalid Brevo API key')
      } else if (error instanceof Brevo.TooManyRequestsError) {
        console.error('Rate limited by Brevo')
      } else if (error instanceof BrevoError) {
        console.error('Brevo error', error)
      } else {
        throw error
      }
    }
  }
}
