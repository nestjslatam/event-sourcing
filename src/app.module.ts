import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DddModule } from '@nestjslatam/ddd-lib';
import { EsModule } from '@nestjslatam/es-lib';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AlarmsModule } from './alarms/alarms.module';
import { AlarmsInfrastructureModule } from './alarms/infrastructure/alarms-infrastructure.module';

@Module({
  imports: [
    CqrsModule,
    DddModule,
    MongooseModule.forRoot('mongodb://localhost:27017/es-read-db'),
    EsModule.forRoot({
      mongoUrl: 'mongodb://localhost:27017/es-event-store-db',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: 'beyondnet',
      username: 'postgres',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AlarmsModule.withInfrastucture(
      AlarmsInfrastructureModule.use('orm'), // or AlarmsInfrastructureModule.use('in-memory')..
    ),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
