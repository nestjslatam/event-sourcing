import { DomainIdAsString } from '@nestjslatam/ddd-lib';
import { v4 as uuid } from 'uuid';

export class Id extends DomainIdAsString {
  constructor(value: string) {
    super({ value });
  }

  static create() {
    return new Id(uuid());
  }

  static load(value: string) {
    return new Id(value);
  }

  toJSON() {
    return this.props.value;
  }
}
