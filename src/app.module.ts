import { Module } from '@nestjs/common';
import { DddModule } from '@nestjslatam/es';

@Module({
  imports: [CoreModule, DddModule, SharedModule],
  controllers: [],
  providers: [],
})
export class AppModule {
  static register(options: ApplicationBootstrapOptions) {
    // 👈 new method
    return {
      module: AppModule,
      imports: [
        CoreModule.forRoot(options),
        AlarmsModule.withInfrastucture(
          AlarmsInfrastructureModule.use(options.driver),
        ),
      ],
    };
  }
}
