import { Injectable, OnApplicationBootstrap } from '@nestjs/common';

import {
  DomainEventBus,
  IDomainEvent,
  IDomainEventPublisher,
} from '@nestjslatam/ddd-lib';
import { VersionedAggregateRoot } from '../../../domain/aggregate-root';
import { MongoEventStore } from '../mongo-event-store';
import { EventSerializer } from '../serializers';

@Injectable()
export class EventStorePublisher
  implements OnApplicationBootstrap, IDomainEventPublisher
{
  constructor(
    private readonly eventStore: MongoEventStore,
    private readonly eventBus: DomainEventBus,
    private readonly eventSerializer: EventSerializer,
  ) {}

  onApplicationBootstrap() {
    this.eventBus.publisher = this;
  }

  publish<T extends IDomainEvent = IDomainEvent>(
    event: T,
    dispatcher: VersionedAggregateRoot,
  ) {
    const serializableEvent = this.eventSerializer.serialize(event, dispatcher);
    return this.eventStore.persist(serializableEvent);
  }

  publishAll<T extends IDomainEvent = IDomainEvent>(
    events: T[],
    dispatcher: VersionedAggregateRoot,
  ) {
    const serializableEvents = events
      .map((event) => this.eventSerializer.serialize(event, dispatcher))
      .map((serializableEvent, index) => ({
        ...serializableEvent,
        position: dispatcher.version.value + index + 1,
      }));

    return this.eventStore.persist(serializableEvents);
  }
}
