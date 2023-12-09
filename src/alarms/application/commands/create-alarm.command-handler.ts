import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainEventPublisher } from '@nestjslatam/ddd-lib';
import { Logger } from '@nestjs/common';

import { AlarmFactory } from './../../domain/factories/alarm.factorie';
import { CreateAlarmCommand } from './create-alarm.command';
import { Alarm } from '../../domain/alarm';

@CommandHandler(CreateAlarmCommand)
export class CreateAlarmCommandHandler
  implements ICommandHandler<CreateAlarmCommand>
{
  constructor(
    private readonly eventPublisher: DomainEventPublisher,
    private readonly alarmFactory: AlarmFactory,
  ) {}

  private readonly logger = new Logger(CreateAlarmCommandHandler.name);

  async execute(command: CreateAlarmCommand): Promise<Alarm> {
    this.logger.debug(`Received command ${command.constructor.name}`);

    const alarm = this.alarmFactory.create(
      command.name,
      command.severity,
      command.triggeredAt,
      command.items,
    );

    this.eventPublisher.mergeObjectContext(alarm);

    alarm.commit();

    return alarm;
  }
}
