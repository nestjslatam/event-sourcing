import { DddModule } from '@nestjslatam/ddd-lib';
import { DynamicModule, Module, Type } from '@nestjs/common';

import { CascadingAlarmsSaga } from './application/sagas/cascading-alarms.saga';
import { UnacknowledgedAlarmsSaga } from './application/sagas/unacknowledged-alarms.saga';
import { AlarmsController } from './presenters/http/alarms.controller';
import { AlarmsService } from './application/alarms.service';
import { AlarmFactory } from './domain/factories/alarm.factorie';
import { CreateAlarmCommandHandler } from './application/commands/create-alarm.command-handler';
import { GetAlarmsQueryHandler } from './application/queries/get-alarms.query-handler';
import { AlarmCreatedEventHandler } from './application/handlers/alarm-created.event-handler';
import { AcknowledgeAlarmCommandHandler } from './application/commands/acknowledge-alarm.command-handler';
import { AlarmAcknowledgedEventHandler } from './application/handlers/alarm-acknowledged.event-handler';
import { NotifyFacilitySupervisorCommandHandler } from './application/commands/notify-facility-supervisor.command-handler';

@Module({
  imports: [DddModule],
  controllers: [AlarmsController],
  providers: [
    AlarmsService,
    AlarmFactory,
    CreateAlarmCommandHandler,
    GetAlarmsQueryHandler,
    AlarmCreatedEventHandler,
    AcknowledgeAlarmCommandHandler,
    AlarmAcknowledgedEventHandler,
    CascadingAlarmsSaga,
    NotifyFacilitySupervisorCommandHandler,
    UnacknowledgedAlarmsSaga,
  ],
})
export class AlarmsModule {
  static withInfrastucture(infrastructureModule: Type | DynamicModule) {
    return {
      module: AlarmsModule,
      imports: [infrastructureModule],
    };
  }
}
