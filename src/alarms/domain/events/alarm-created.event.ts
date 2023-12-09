import { DomainEvent } from '@nestjslatam/ddd-lib';
import { AutowiredEvent } from '@nestjslatam/es-lib';

import { Alarm } from '../alarm';

@AutowiredEvent
export class AlarmCreatedEvent extends DomainEvent {
  constructor(public readonly alarm: Alarm) {
    super({
      aggregateId: alarm.getId(),
      eventName: AlarmCreatedEvent.name,
      data: alarm,
    });
  }
}
