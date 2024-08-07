import {
  Controller,
  Body,
  Post,
  Res,
  HttpException,
  HttpStatus,
  Patch,
  Get,
  Put,
  Req,
  UseGuards,
  Param
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request, Response } from "express";
import AES from "crypto-js/aes";
import { Throttle } from "@nestjs/throttler";
import { JwtService } from "@nestjs/jwt";

import { formLoginDTO } from "@schemas/v1/form.schema";
import { Employee } from "@models/v1/employees.model";
import EmployeeService from "@modules/v1/users/employees/employees.service";
import { AuthorizationGuard } from "@middlewares/v1/authorize.middleware";

@Controller("api/v1/users/employees")
export class EmployeesController {
  constructor(
    private readonly _configService: ConfigService,
    private readonly _jwtService: JwtService
  ) {}

  @Post("sign-in")
  async signIn(
    @Body() form: formLoginDTO<string>,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ) {
    const services = {
      jwt: this._jwtService,
      config: this._configService
    };
    const setCookie = async (key, value, type) => {
      response.cookie(
        key,
        await this._jwtService.signAsync(
          {
            _data: AES.encrypt(
              value,
              this._configService.get("env.secret")
            )
          },
          {
            secret: this._configService.get("env.secret")
          }
        ),
        {
          signed: true,
          maxAge: this._configService.get(
            type
              ? "env.access_token_ttl"
              : "env.refresh_token_ttl"
          )
        }
      );
    };
    const callback = async function(userId: string) {
      //// Set up cookie for access token and refresh token
      await setCookie("accessToken", userId, 1);
      await setCookie("refreshToken", userId, 0);

      response.redirect(
        `/api/v1/users/employees/${userId}/me?t=1`
      );
    };
    try {
      await EmployeeService.ProcessLoginForEmployee(
        form,
        services,
        callback.bind(this)
      );
      return;
    } catch (error) {
      throw new HttpException(
        "Unvalid.",
        HttpStatus.NOT_ACCEPTABLE
      );
    }
  }

  @UseGuards(AuthorizationGuard)
  @Patch(":employeeId/profile/edit")
  async updateEmployeeProfile() {}

  @Put("create")
  async createNewEmployeeProfile(@Body() container: { data: string }) {
    const { data } = container
    const services = {
      jwt: this._jwtService,
      config: this._configService
    };
    try {
      // await EmployeeService.ProcessRegisterNewEmployee(data, callback.bind(this))
    } catch (error) {
      throw new HttpException('Cannot register.', HttpStatus.CONFLICT)
    }
  }

  @UseGuards(AuthorizationGuard)
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Get(":employeeId/me")
  async getMe(
    @Res() response: Response,
    @Param("employeeId") employeeId: string
  ) {
    const user = await Employee.findByPk(employeeId);
    response.status(HttpStatus.OK).send(user);
  }
}
