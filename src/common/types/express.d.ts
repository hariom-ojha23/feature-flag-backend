import { TokenPayload } from '../interfaces/token.interface'

declare global {
  namespace Express {
    interface User extends TokenPayload {}
  }
}

export {}