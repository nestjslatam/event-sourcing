import { Alarm } from '../../../../domain/alarm';
import { AlarmEntity } from '../entities/alarm.entity';
import { AlarmItemEntity } from '../entities/alarm-item.entity';

export class AlarmMapper {
  static toDomain(alarmEntity: AlarmEntity): Alarm {
    const alarmModel = Alarm.load({
      id: alarmEntity.id,
      name: alarmEntity.name,
      severity: alarmEntity.severity,
      triggeredAt: alarmEntity.triggeredAt,
      isAcknowledged: alarmEntity.isAsknowledged,
      items: alarmEntity.items,
    });

    return alarmModel;
  }
  static toPersistence(alarm: Alarm) {
    const alarmEntity = new AlarmEntity();
    alarmEntity.id = alarm.getId();
    alarmEntity.name = alarm.getPropsCopy().name.unpack();
    alarmEntity.severity = alarm.getPropsCopy().severity.value;
    alarmEntity.triggeredAt = alarm.getPropsCopy().triggeredAt;
    alarmEntity.isAsknowledged = alarm.getPropsCopy().isAcknowledged;
    alarmEntity.items = alarm.getPropsCopy().items.map((item) => {
      const alarmItemEntity = new AlarmItemEntity();
      alarmItemEntity.id = item.getPropsCopy().id;
      alarmItemEntity.name = item.getPropsCopy().name;
      alarmItemEntity.type = item.getPropsCopy().type;
      return alarmItemEntity;
    });

    return alarmEntity;
  }
}
