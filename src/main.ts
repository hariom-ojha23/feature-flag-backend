import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // global prefix
  app.setGlobalPrefix('api/v1')

  // cors configuration
  app.enableCors()

  const PORT = process.env.PORT ?? 3000
  await app.listen(PORT).then(() => {
    console.log(`Server is running on port ${PORT}`)
  })
}
bootstrap()
