import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EVENT_STORE_CONNECTION } from './core.constants';
import { EsOptions } from './core.options';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_ES_URL, {
      connectionName: EVENT_STORE_CONNECTION,
      directConnection: true,
    }),
  ],
})
export class CoreModule {
  static forRoot(options: EsOptions) {
    const imports =
      options.driver === 'orm'
        ? [
            TypeOrmModule.forRoot({
              type: 'postgres',
              host: process.env.POSTGRES_HOST,
              port: parseInt(process.env.POSTGRES_PORT, 10),
              username: process.env.POSTGRES_USER,
              password: process.env.POSTGRES_PASSWORD,
              autoLoadEntities: true,
              synchronize: true,
            }),
            MongooseModule.forRoot(process.env.MONGODB_URL),
          ]
        : [];

    return {
      module: CoreModule,
      imports,
    };
  }
}
