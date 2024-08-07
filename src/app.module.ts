import { Module } from "@nestjs/common";
import {
  ConfigModule,
  ConfigService
} from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ThrottlerModule } from "@nestjs/throttler";

import configuration from "./configuration";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

//// Declare all modules
import { EmployeesModule } from "@modules/v1/users/employees/employees.module";
import { StudentsModule } from "@modules/v1/users/students/students.module";
import { ScoresModule } from "@modules/v1/scores/scores.module";

//// Declare all models
import { Student } from "@models/v1/students.model";
import { Employee } from "@models/v1/employees.model";
import { Lession } from "@models/v1/lessions.model";
import { Semester } from "@models/v1/semester.model";
import { Subject } from "@models/v1/subjects.model";
import { StudentClass } from "@models/v1/junk_tables/students_classes.model";
import { SubjectedTeacher } from "@models/v1/junk_tables/subjected_teachers.model";
import { Class } from "@models/v1/classes.model";

import { AuthorizationGuard } from "@middlewares/v1/authorize.middleware";
import { AuthModule } from "./v1/gateways/auth.module";
import { QiModule } from "./v1/gateways/qi.module";

const { database, env } = configuration;

@Module({
  imports: [
    AuthModule,
    QiModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [database, env]
    }),
    SequelizeModule.forRootAsync({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [database, env]
        })
      ],
      useFactory: (configService: ConfigService) => ({
        dialect: configService.get("database.type"),
        uri: configService.get("database.uri"),
        port: configService.get("database.port"),
        username: configService.get("database.username"),
        password: configService.get("database.password"),
        database: configService.get("database.name"),
        entities: [],
        models: [
          Employee,
          Student,
          Class,
          Lession,
          Semester,
          Subject,
          StudentClass,
          SubjectedTeacher
        ],
        dialectOptions: {
          ssl: {
            rejectUnauthorized: false, // Trust the self-signed certificate
          }
        },
        synchronize: true,
      }),
      inject: [ConfigService]
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get("env.throttle_ttl"),
          limit: configService.get("env.throttle_limit")
        }
      ]
    }),
    JwtModule.registerAsync({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration.database, configuration.env]
        })
      ],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get("env.secret");
        return new Promise((resolve) => {
          resolve({
            secret
          });
        });
      }
    })
    // StudentsModule,
    // ScoresModule,
    // EmployeesModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ConfigService,
    JwtService,
    AuthorizationGuard
  ],
  exports: [JwtService]
})
export class AppModule {}
