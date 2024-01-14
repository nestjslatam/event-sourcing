import { DomainIdAsString } from '@nestjslatam/ddd-lib';
import { v4 as uuid } from 'uuid';

export class Id extends DomainIdAsString {
  static create() {
    return new Id(uuid());
  }

  static load(value: string) {
    return new Id(value);
  }

  toJSON() {
    return this._props.value.toString();
  }
}
