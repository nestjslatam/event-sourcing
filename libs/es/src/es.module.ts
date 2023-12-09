import { Module } from '@nestjs/common';

import { CoreModule } from './core/core.module';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [ConfigModule.forRoot(), CoreModule, SharedModule],
  exports: [],
})
export class DddModule {}
