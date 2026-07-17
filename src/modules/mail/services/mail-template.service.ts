import { Injectable, OnModuleInit } from '@nestjs/common'
import { readFileSync } from 'fs'
import { join } from 'path'

@Injectable()
export class MailTemplateService implements OnModuleInit {
  private templates = new Map<string, string>()

  onModuleInit() {
    this.templates.set(
      'otp-verification',
      readFileSync(join(__dirname, '..', 'templates', 'otp-verify-email.html'), 'utf-8'),
    )
  }

  render(templateName: string, vars: Record<string, string>): string {
    let html = this.templates.get(templateName)
    if (!html) throw new Error(`Template "${templateName}" not found`)

    for (const [key, value] of Object.entries(vars)) {
      html = html.replaceAll(`{{${key}}}`, value)
    }
    return html
  }
}
