import {
  Injectable,
  CanActivate,
  ExecutionContext
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import AES from "crypto-js/aes";
import CryptoJS from "crypto-js";

import { Employee } from "@models/v1/employees.model";
import { Student } from "@models/v1/students.model";

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly _jwtService: JwtService,
    private readonly _configService: ConfigService
  ) {}

  async canActivate(
    context: ExecutionContext
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const type = request.query.t && (parseInt(request.query.t) ? 'employee' : 'student')
    const accessToken = request.signedCookies?.accessToken;
    const refreshToken =
      request.signedCookies?.refreshToken;

    return new Promise(async (resolve, reject) => {
      let payloadFromAccessToken: { _data: string },
        payloadFromRefreshToken: { _data: String };

      try {
        payloadFromAccessToken =
          await this._jwtService.verifyAsync(
            accessToken,
            this._configService.get("env.secret")
          );
        if (
          payloadFromAccessToken &&
          payloadFromAccessToken._data
        ) {
          payloadFromRefreshToken = await this._jwtService.verifyAsync(
            refreshToken,
            this._configService.get("env.secret")
          );

          if (payloadFromRefreshToken && payloadFromRefreshToken._data) {
            const userIdFromAccessToken = AES.decrypt(
              payloadFromAccessToken._data,
              this._configService.get("env.secret")
            ).toString(CryptoJS.enc.Utf8);

            const userIdFromRefreshToken = AES.decrypt(
              payloadFromAccessToken._data,
              this._configService.get("env.secret")
            ).toString(CryptoJS.enc.Utf8);

            if (userIdFromAccessToken === userIdFromRefreshToken) {
              switch (type) {
                case 'employee': {
                  const user = await Employee.findByPk(userIdFromAccessToken)
                  if (user) {
                    resolve(true)
                    break;
                  } else {
                    reject(false)
                    break;
                  }
                }

                case 'student': {
                  const user = await Student.findByPk(userIdFromAccessToken)
                  if (user) {
                    resolve(true)
                    break;
                  } else {
                    reject(false)
                    break;
                  }
                }

                default: {
                  reject(false)
                  break;
                }
              }
            }
          }
        }
      } catch (error) {
        reject(false);
      }
    });
  }
}
