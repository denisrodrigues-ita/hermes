import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/public.decorator';

@Controller('health-check')
export class HealthCheckController {
  @Public()
  @Get()
  healthCheck(): string {
    return '🦶🪽';
  }

  @Get('protected')
  adminHealthCheck(): string {
    return '🦶🪽 Protected Access 🦶🪽';
  }
}
