import { Module } from '@nestjs/common';

import { ScoresController } from "@modules/v1/scores/scores.controller";

@Module({
  controllers: [ScoresController]
})
export class ScoresModule {}
