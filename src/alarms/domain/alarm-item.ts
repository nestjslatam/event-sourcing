import { TrackingProps } from '@nestjslatam/ddd-lib';
import { DomainEntity, DomainIdAsString } from '@nestjslatam/ddd-lib';

import { Id } from './value-objects/id';
import { Name } from './value-objects/name';
import { Type } from './value-objects/type';

export interface IAlarmItemProps {
  name: Name;
  type: Type;
}

export class AlarmItem extends DomainEntity<any> {
  constructor(
    id: DomainIdAsString,
    props: IAlarmItemProps,
    trackingProps: TrackingProps,
  ) {
    super({
      id,
      props,
      trackingProps,
    });
  }

  static create(name: Name, type: Type): AlarmItem {
    return new AlarmItem(Id.create(), { name, type }, TrackingProps.setNew());
  }

  protected businessRules(props: any): void {
    if (props.name.unpack().length < 3) {
      throw new Error('Name must be at least 3 characters long');
    }

    if (props.type.value === 'critical') {
      throw new Error('Critical alarms cannot be created');
    }
  }
}
