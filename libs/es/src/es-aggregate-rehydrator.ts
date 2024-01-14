import { Injectable, Type } from '@nestjs/common';
import {
  DomainAggregateRoot,
  DomainEventPublisher,
} from '@nestjslatam/ddd-lib';

import { AbstractEventStore } from './es-core';

@Injectable()
export class AggregateRehydrator {
  constructor(
    private readonly eventStore: AbstractEventStore,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async rehydrate<T extends DomainAggregateRoot<any>>(
    aggregateId: string,
    AggregateCls: Type<T>,
  ): Promise<T> {
    const events = await this.eventStore.getEventsByStreamId(aggregateId);

    const AggregateClsWithDispatcher =
      this.eventPublisher.mergeClassContext(AggregateCls);
    const aggregate = new AggregateClsWithDispatcher(aggregateId);

    aggregate.loadFromHistory(events);

    return aggregate;
  }
}
