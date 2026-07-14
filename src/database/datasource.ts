import { DataSource, DataSourceOptions } from 'typeorm'
import { CustomNamingStrategy } from '../common/strategies/naming.strategy'
import * as dotenv from 'dotenv'
dotenv.config()

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  namingStrategy: new CustomNamingStrategy(),
  synchronize: true,

  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
}

export const dataSource = new DataSource(dataSourceOptions)
