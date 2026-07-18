import { Injectable, OnModuleInit } from '@nestjs/common'
import { readFileSync } from 'fs'
import { join } from 'path'
import { LOGO_URLS } from '../../../common/enums/logo-urls.enum'

@Injectable()
export class MailTemplateService implements OnModuleInit {
  private templates = new Map<string, string>()
  private logoUrl = LOGO_URLS.LOGO

  onModuleInit() {
    this.templates.set(
      'otp-verification',
      readFileSync(join(__dirname, '..', 'templates', 'otp-verify-email.html'), 'utf-8'),
    )
  }

  render(templateName: string, vars: Record<string, string>): string {
    vars = {
      ...vars,
      LOGO_URL: this.logoUrl,
    }
    let html = this.templates.get(templateName)
    if (!html) throw new Error(`Template "${templateName}" not found`)

    for (const [key, value] of Object.entries(vars)) {
      html = html.replaceAll(`{{${key}}}`, value)
    }
    return html
  }
}
