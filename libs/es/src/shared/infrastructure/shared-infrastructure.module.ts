import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { EVENT_STORE_CONNECTION } from '../../core';
import {
  EventSerializer,
  MongoEventStore,
  EventStorePublisher,
  EventDeserializer,
  EventsBridge,
  Event,
  EventSchema,
} from './event-store';
import { EventStore } from './application';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Event.name, schema: EventSchema }],
      EVENT_STORE_CONNECTION,
    ),
  ],
  providers: [
    EventSerializer,
    EventStorePublisher,
    MongoEventStore,
    EventsBridge,
    EventDeserializer,
    {
      provide: EventStore,
      useExisting: MongoEventStore,
    },
  ],
  exports: [EventStore],
})
export class SharedInfrastructureModule {}
