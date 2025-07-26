import { Module } from '@nestjs/common';
import { HealthCheckController } from './health-check.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [HealthCheckController],
})
export class HealthCheckModule {}
