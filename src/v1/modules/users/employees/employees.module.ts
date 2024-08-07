import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';

import { EmployeesController } from "@modules/v1/users/employees/employees.controller";
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from 'src/configuration';

@Module({
  imports: [],
  controllers: [EmployeesController],
  providers: []
})
export class EmployeesModule {}
