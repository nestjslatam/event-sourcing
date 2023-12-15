import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DddModule } from '@nestjslatam/ddd-lib';

import {
  EVENT_STORE_CONNECTION,
  EventsBridge,
  MongoEventStore,
} from './es-store';
import { AbstractEventStore, EsOptions } from './es-core';
import { EventSerializer } from './es-serializers';
import { EventStorePublisher } from './es-eventstore.publisher';
import { EventDeserializer } from './es-deserializers';

@Module({
  imports: [ConfigModule.forRoot(), DddModule],
  providers: [
    EventSerializer,
    EventStorePublisher,
    MongoEventStore,
    EventsBridge,
    EventDeserializer,
    {
      provide: AbstractEventStore,
      useExisting: MongoEventStore,
    },
  ],
  exports: [AbstractEventStore],
})
export class EsModule {
  static forRoot(options: EsOptions) {
    const imports = [
      DddModule,
      MongooseModule.forRoot(options.mongoUrl, {
        connectionName: EVENT_STORE_CONNECTION,
        directConnection: true,
      }),
    ];

    return {
      module: EsModule,
      imports,
    };
  }
}
