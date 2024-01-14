import { Logger } from '@nestjs/common';

import { AlarmAcknowledgedEvent } from '../../domain/events/alarm-acknowledged.event';
import { UpsertMaterializedAlarmRepository } from '../ports/upset-materalized-alarm.repository';
import {
  DomainEventHandler,
  IDomainEventHandler,
  SerializedEventPayload,
} from '@nestjslatam/ddd-lib';

@DomainEventHandler(AlarmAcknowledgedEvent)
export class AlarmAcknowledgedEventHandler
  implements
    IDomainEventHandler<SerializedEventPayload<AlarmAcknowledgedEvent>>
{
  private readonly logger = new Logger(AlarmAcknowledgedEventHandler.name);

  constructor(
    private readonly upsertMaterializedAlarmRepository: UpsertMaterializedAlarmRepository,
  ) {}

  async handle(event: SerializedEventPayload<AlarmAcknowledgedEvent>) {
    this.logger.log(`Alarm acknowledged event: ${JSON.stringify(event)}`);
    // In a real-world application, we would have to ensure that this event is
    // redelivered in case of a failure. Otherwise, we would end up with an inconsistent state.
    await this.upsertMaterializedAlarmRepository.upsert({
      id: event.alarmId,
      isAcknowledged: true,
    });
  }
}
