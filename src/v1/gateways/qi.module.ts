import { Module } from '@nestjs/common';
import { QiGateway } from './qi.gateway';

@Module({
  providers: [QiGateway],
})
export class QiModule {}