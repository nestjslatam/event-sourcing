/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  TrackingProps,
  DomainIdAsString,
  DomainAggregateRoot,
  SerializedEventPayload,
  BrokenRule,
} from '@nestjslatam/ddd-lib';
import { v4 as uuid } from 'uuid';

import { AlarmItem } from './alarm-item';
import { AlarmAcknowledgedEvent } from './events/alarm-acknowledged.event';
import { AlarmCreatedEvent } from './events/alarm-created.event';
import { AlarmSeverity, Name, Id, Type } from './value-objects';

export interface IAlarmProps {
  name: Name;
  severity: AlarmSeverity;
  triggeredAt: Date;
  isAcknowledged: boolean;
  items: Array<AlarmItem>;
}

export interface IAlarmRaw {
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

export class Alarm extends DomainAggregateRoot<IAlarmProps> {
  constructor(
    id: DomainIdAsString,
    props: IAlarmProps,
    trackingProps: TrackingProps,
  ) {
    super(id, props, trackingProps);
  }

  protected businessRules(props: IAlarmProps): void {
    if (props.name.unpack().length < 3) {
      this.addBrokenRule(
        new BrokenRule('name', 'Name must be at least 3 characters long'),
      );
    }

    if (props.severity === AlarmSeverity.CRITICAL) {
      this.addBrokenRule(
        new BrokenRule('severity', 'Critical alarms cannot be created'),
      );
    }
  }

  static create(name: Name, severity: AlarmSeverity) {
    const alarm = new Alarm(
      DomainIdAsString.create(uuid()),
      {
        name,
        severity,
        triggeredAt: new Date(),
        isAcknowledged: false,
        items: [],
      },
      TrackingProps.setNew(),
    );

    alarm.apply(new AlarmCreatedEvent(alarm), {
      fromHistory: false,
      skipHandler: true,
    });

    return alarm;
  }

  static fromRaw(props: IAlarmRaw): Alarm {
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

  acknowledge() {
    this.apply(new AlarmAcknowledgedEvent(this.id), {
      fromHistory: false,
      skipHandler: true,
    });
  }

  addAlarmItem(item: AlarmItem) {
    this.props.items.push(item);
  }

  [`on${AlarmCreatedEvent.name}`](
    event: SerializedEventPayload<AlarmCreatedEvent>,
  ) {
    const alarmRaw = {
      id: event.aggregateId,
      ...event.data,
    } as IAlarmRaw;

    const alarm = Alarm.fromRaw(alarmRaw);

    this.props.name = alarm.props.name;
    this.props.severity = alarm.props.severity;
    this.props.triggeredAt = alarm.props.triggeredAt;
    this.props.isAcknowledged = alarm.props.isAcknowledged;
    this.props.items = alarm.props.items.map(
      (item) => new AlarmItem(item.props.id, item.props.name, item.props.type),
    );
  }

  [`on${AlarmAcknowledgedEvent.name}`](
    event: SerializedEventPayload<AlarmAcknowledgedEvent>,
  ) {
    if (this.props.isAcknowledged) {
      throw new Error('Alarm has already been acknowledged');
    }
    this.props.isAcknowledged = true;
  }
}
