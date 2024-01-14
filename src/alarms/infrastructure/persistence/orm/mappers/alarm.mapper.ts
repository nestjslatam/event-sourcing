import { Alarm } from '../../../../domain/alarm';
import { AlarmEntity } from '../entities/alarm.entity';
import { AlarmItemEntity } from '../entities/alarm-item.entity';

export class AlarmMapper {
  static toDomain(alarmEntity: AlarmEntity): Alarm {
    const alarmModel = Alarm.fromRaw({
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
    alarmEntity.id = alarm.id;
    alarmEntity.name = alarm.props.name.unpack();
    alarmEntity.severity = alarm.props.severity.value;
    alarmEntity.triggeredAt = alarm.props.triggeredAt;
    alarmEntity.isAsknowledged = alarm.props.isAcknowledged;
    alarmEntity.items = alarm.props.items.map((item) => {
      const alarmItemEntity = new AlarmItemEntity();
      alarmItemEntity.id = item.props.id;
      alarmItemEntity.name = item.props.name;
      alarmItemEntity.type = item.props.type;
      return alarmItemEntity;
    });

    return alarmEntity;
  }
}
