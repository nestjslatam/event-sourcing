import { TrackingProps } from '@nestjslatam/ddd-lib';

/* eslint-disable @typescript-eslint/no-unused-vars */
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
    //
  }
}
