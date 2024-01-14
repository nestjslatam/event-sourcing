import { DomainEvent } from '@nestjslatam/ddd-lib';
import { EsAutowiredEvent } from '@nestjslatam/es-lib';

import { Alarm } from '../alarm';

@EsAutowiredEvent
export class AlarmCreatedEvent extends DomainEvent {
  constructor(public readonly alarm: Alarm) {
    super({
      aggregateId: alarm.id,
      eventName: AlarmCreatedEvent.name,
      data: alarm,
    });
  }
}
