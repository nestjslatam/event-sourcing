import { DomainEnum } from '@nestjslatam/ddd-lib';

export class AlarmSeverity extends DomainEnum<string> {
  static readonly CRITICAL = new AlarmSeverity('critical');
  static readonly HIGH = new AlarmSeverity('high');
  static readonly MEDIUM = new AlarmSeverity('medium');
  static readonly LOW = new AlarmSeverity('low');

  private constructor(value: string) {
    super(value, ['critical', 'high', 'medium', 'low']);
  }

  toJSON() {
    return this.value;
  }
}
