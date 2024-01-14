import { DomainEvent } from '@nestjslatam/ddd-lib';
import { EsAutowiredEvent } from '@nestjslatam/es-lib';

@EsAutowiredEvent
export class AlarmAcknowledgedEvent extends DomainEvent {
  constructor(public readonly alarmId: string) {
    super({
      aggregateId: alarmId,
      eventName: AlarmAcknowledgedEvent.name,
      data: { alarmId: alarmId },
    });
  }
}
