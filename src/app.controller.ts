import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'

import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(
    private readonly _appService: AppService,
    private readonly _configService: ConfigService
  ) {}

  @Get()
  getHello(): string {
    console.log(this._configService.get('env.secret'))
    return this._appService.getHello();
  }

  @Get("momo")
  getDemo(@Res({ passthrough: true }) res: Response) {
    
  }
}
