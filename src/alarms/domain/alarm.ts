/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  EsDomainAggregateRoot,
  SerializedEventPayload,
} from '@nestjslatam/es-lib';
import { TrackingProps, DomainIdAsString } from '@nestjslatam/ddd-lib';
import { v4 as uuid } from 'uuid';

import { AlarmItem } from './alarm-item';
import { AlarmAcknowledgedEvent } from './events/alarm-acknowledged.event';
import { AlarmCreatedEvent } from './events/alarm-created.event';
import { AlarmSeverity } from './value-objects/alarm-severity';
import { Name } from './value-objects/name';
import { Id } from './value-objects/id';
import { Type } from './value-objects/type';

export interface IAlarmProps {
  name: Name;
  severity: AlarmSeverity;
  triggeredAt: Date;
  isAcknowledged: boolean;
  items: Array<AlarmItem>;
}

export interface IAlarmLoadProps {
  id: string;
  name: string;
  severity: string;
  triggeredAt: Date;
  isAcknowledged: boolean;
  items: Array<{
    id: string;
    name: string;
    type: string;
  }>;
}

export class Alarm extends EsDomainAggregateRoot<IAlarmProps> {
  constructor(
    id: DomainIdAsString,
    props: IAlarmProps,
    trackingProps: TrackingProps,
  ) {
    super(id, props, trackingProps);
  }

  static create(name: Name, severity: AlarmSeverity) {
    const alarm = new Alarm(
      new DomainIdAsString(uuid()),
      {
        name,
        severity,
        triggeredAt: new Date(),
        isAcknowledged: false,
        items: [],
      },
      TrackingProps.setNew(),
    );

    alarm.apply(new AlarmCreatedEvent(alarm));
    return alarm;
  }

  static load(props: IAlarmLoadProps): Alarm {
    const { id, name, severity, triggeredAt, isAcknowledged, items } = props;
    const alarm = new Alarm(
      Id.load(id),
      {
        name: Name.create(name),
        severity: AlarmSeverity[severity],
        triggeredAt,
        isAcknowledged,
        items: items.map(
          (item) =>
            new AlarmItem(
              Id.load(item.id),
              {
                name: Name.create(item.name),
                type: Type.create(item.type),
              },
              TrackingProps.setDirty(),
            ),
        ),
      },
      TrackingProps.setDirty(),
    );
    return alarm;
  }

  protected businessRules(props: IAlarmProps): void {}

  acknowledge() {
    this.apply(new AlarmAcknowledgedEvent(this.getId()));
  }

  addAlarmItem(item: AlarmItem) {
    this.props.items.push(item);
  }

  // [`on${AlarmCreatedEvent.name}`](
  //   event: SerializedEventPayload<AlarmCreatedEvent>,
  // ) {
  //   const alarm = event.alarm as Alarm;
  //   this.props.name = Name.create(alarm.getPropsCopy().name.unpack());
  //   this.props.severity = alarm.getPropsCopy().severity;
  //   this.props.triggeredAt = alarm.getPropsCopy().triggeredAt;
  //   this.props.isAcknowledged = alarm.getPropsCopy().isAcknowledged;
  //   this.props.items = alarm
  //     .getPropsCopy()
  //     .items.map(
  //       (item) =>
  //         new AlarmItem(
  //           item.getPropsCopy().id,
  //           item.getPropsCopy().name,
  //           item.getPropsCopy().type,
  //         ),
  //     );
  // }

  // [`on${AlarmAcknowledgedEvent.name}`](
  //   event: SerializedEventPayload<AlarmAcknowledgedEvent>,
  // ) {
  //   if (this.getPropsCopy().isAcknowledged) {
  //     throw new Error('Alarm has already been acknowledged');
  //   }
  //   this.props.isAcknowledged = true;
  // }
}
