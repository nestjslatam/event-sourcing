import { Injectable } from '@nestjs/common';

import { Alarm } from '../alarm';
import { AlarmItem } from '../alarm-item';
import { AlarmCreatedEvent } from '../events/alarm-created.event';
import { Name } from '../value-objects/name';
import { AlarmSeverity } from '../value-objects/alarm-severity';
import { Type } from '../value-objects/type';

@Injectable()
export class AlarmFactory {
  create(
    name: string,
    severity: string,
    triggeredAt: Date,
    items: Array<{ name: string; type: string }>,
  ): Alarm {
    const alarm = Alarm.create(Name.create(name), AlarmSeverity[severity]);

    items
      .map((item) =>
        AlarmItem.create(Name.create(item.name), Type.create(item.type)),
      )
      .forEach((item) => {
        alarm.addAlarmItem(item);
      });

    alarm.apply(new AlarmCreatedEvent(alarm), { skipHandler: true });

    return alarm;
  }
}
