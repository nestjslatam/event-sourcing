import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import {
  DomainAggregateRoot,
  DomainEventBus,
  IDomainEvent,
  IDomainEventPublisher,
  DomainEventSerializer,
} from '@nestjslatam/ddd-lib';

import { MongoEventStore } from './es-store/mongo-event-store';

@Injectable()
export class EventStorePublisher
  implements OnApplicationBootstrap, IDomainEventPublisher
{
  constructor(
    private readonly eventStore: MongoEventStore,
    private readonly eventBus: DomainEventBus,
    private readonly eventSerializer: DomainEventSerializer,
  ) {}

  onApplicationBootstrap() {
    this.eventBus.publisher = this;
  }

  publish<T extends IDomainEvent = IDomainEvent>(
    event: T,
    dispatcher: DomainAggregateRoot<any>,
  ) {
    const serializableEvent = this.eventSerializer.serialize(event, dispatcher);
    return this.eventStore.persist(serializableEvent);
  }

  publishAll<T extends IDomainEvent = IDomainEvent>(
    events: T[],
    dispatcher: DomainAggregateRoot<any>,
  ) {
    const serializableEvents = events
      .map((event) => this.eventSerializer.serialize(event, dispatcher))
      .map((serializableEvent, index) => ({
        ...serializableEvent,
        position: dispatcher.version + index + 1,
      }));

    return this.eventStore.persist(serializableEvents);
  }
}
