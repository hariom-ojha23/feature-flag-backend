export interface SendEmailOptions {
  to: { email: string; name?: string }[]
  subject: string
  htmlContent: string
  textContent?: string
}