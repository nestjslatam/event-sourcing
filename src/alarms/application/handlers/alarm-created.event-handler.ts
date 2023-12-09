import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SerializedEventPayload } from '@nestjslatam/es-lib';

import { Alarm } from '../../domain/alarm';
import { AlarmCreatedEvent } from '../../domain/events/alarm-created.event';
import { UpsertMaterializedAlarmRepository } from '../ports/upset-materalized-alarm.repository';

@EventsHandler(AlarmCreatedEvent)
export class AlarmCreatedEventHandler
  implements IEventHandler<SerializedEventPayload<AlarmCreatedEvent>>
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
    const alarm = event.alarm as Alarm;

    await this.upsertMaterializedAlarmRepository.upsert({
      id: alarm.getId(),
      name: alarm.getPropsCopy().name.unpack(),
      severity: alarm.getPropsCopy().severity.value,
      triggeredAt: new Date(alarm.getPropsCopy().triggeredAt),
      isAcknowledged: alarm.getPropsCopy().isAcknowledged,
      items: alarm.getPropsCopy().items.map((item) => ({
        id: item.getPropsCopy().id,
        name: item.getPropsCopy().name,
        type: item.getPropsCopy().type,
      })),
    });
  }
}
