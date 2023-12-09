import { DomainEvent } from '@nestjslatam/ddd-lib';
import { AutowiredEvent } from '@nestjslatam/es-lib';

@AutowiredEvent
export class AlarmAcknowledgedEvent extends DomainEvent {
  constructor(public readonly alarmId: string) {
    super({
      aggregateId: alarmId,
      eventName: AlarmAcknowledgedEvent.name,
      data: JSON.stringify({ alarmId }),
    });
  }
}
