import {
  BrokenRule,
  AbstractDomainString,
  IDomainPrimitive,
} from '@nestjslatam/ddd-lib';

export class Type extends AbstractDomainString {
  constructor(value: string) {
    super(value);
  }

  static create(value: string) {
    return new Type(value);
  }

  toJSON() {
    return this._props.value;
  }

  protected businessRules(props: IDomainPrimitive<string>): void {
    if (props.value.length < 3) {
      this.addBrokenRule(new BrokenRule('name', 'the Type is too short'));
    }

    if (props.value.length > 350) {
      this.addBrokenRule(new BrokenRule('name', 'the Type is too long'));
    }
  }
}
