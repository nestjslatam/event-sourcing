import { Logger } from '@nestjs/common';

import { Alarm, IAlarmRaw } from '../../domain/alarm';
import { AlarmCreatedEvent } from '../../domain/events/alarm-created.event';
import { UpsertMaterializedAlarmRepository } from '../ports/upset-materalized-alarm.repository';
import {
  DomainEventHandler,
  IDomainEventHandler,
  SerializedEventPayload,
} from '@nestjslatam/ddd-lib';

@DomainEventHandler(AlarmCreatedEvent)
export class AlarmCreatedEventHandler
  implements IDomainEventHandler<SerializedEventPayload<AlarmCreatedEvent>>
{
  private readonly logger = new Logger(AlarmCreatedEventHandler.name);

  constructor(
    private readonly upsertMaterializedAlarmRepository: UpsertMaterializedAlarmRepository,
  ) {}

  async handle(event: SerializedEventPayload<AlarmCreatedEvent>) {
    this.logger.log(`Alarm created event: ${JSON.stringify(event)}`);

    // In a real-world application, we would have to ensure that this operation is atomic
    // with the creation of the alarm. Otherwise, we could end up with an alarm that is not reflected
    // in the read model (e.g. because the database operation fails).
    // For more information, check out "Transactional inbox/outbox pattern".
    const alarmRaw = {
      id: event.aggregateId,
      name: event.alarm.propsCopy.name,
      severity: event.alarm.propsCopy.severity,
      triggeredAt: new Date(event.alarm.propsCopy.triggeredAt),
      isAcknowledged: false,
      items: event.alarm.propsCopy.items.map((item) => ({
        id: item.propsCopy.id,
        name: item.propsCopy.name,
        type: item.propsCopy.type,
      })),
    } as IAlarmRaw;

    const alarm = Alarm.fromRaw(alarmRaw);

    await this.upsertMaterializedAlarmRepository.upsert({
      id: alarm.id,
      name: alarm.propsCopy.name.unpack(),
      severity: alarm.propsCopy.severity.value,
      triggeredAt: new Date(alarm.propsCopy.triggeredAt),
      isAcknowledged: alarm.propsCopy.isAcknowledged,
      items: alarm.propsCopy.items.map((item) => ({
        id: item.propsCopy.id,
        name: item.propsCopy.name,
        type: item.propsCopy.type,
      })),
    });
  }
}
