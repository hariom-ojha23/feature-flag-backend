import * as dotenv from 'dotenv'
dotenv.config()

export const setupEnvironmentVariables = () => {
  process.env = {
    ...process.env,
    PORT: '3000',
    JWT_ACCESS_SECRET: 'H@riomOjh@',
    JWT_REFRESH_SECRET: 'H@riomOjh@',

    APP_ENV: '0',

    DB_HOST: 'localhost',
    DB_PORT: '3306',
    DB_NAME: 'feature_flag',
    DB_USER: 'root',
    DB_PASSWORD: '123456'
  }
}
