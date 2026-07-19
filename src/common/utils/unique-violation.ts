import { QueryFailedError } from 'typeorm'
import { UNIQUE_VIOLATION_CODES } from '../enums/unique-violation.enum'

export function isUniqueViolation(error: unknown): boolean {
  if (!(error instanceof QueryFailedError)) return false

  const driverError = error as any
  const code = driverError.code

  return Object.values(UNIQUE_VIOLATION_CODES).includes(code)
}
