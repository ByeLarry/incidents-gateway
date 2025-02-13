import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [ConfigService],
})
export class HealthModule {}
