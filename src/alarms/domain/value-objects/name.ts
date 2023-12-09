import {
  BrokenRule,
  AbstractDomainString,
  IDomainPrimitive,
} from '@nestjslatam/ddd-lib';

export class Name extends AbstractDomainString {
  constructor(value: string) {
    super(value);
  }

  static create(value: string) {
    return new Name(value);
  }

  toJSON() {
    return this.props.value;
  }

  protected businessRules(props: IDomainPrimitive<string>): void {
    if (props.value.length < 3) {
      this.addBrokenRule(new BrokenRule('name', 'the name is too short'));
    }

    if (props.value.length > 350) {
      this.addBrokenRule(new BrokenRule('name', 'the name is too long'));
    }
  }
}
