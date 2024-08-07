import 'module-alias/register';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config'
import { AppModule } from './app.module';
import RedisIoAdapter from './redis.adapter'
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  const configService = app.get(ConfigService)
  app.use(cookieParser(configService.get('env.secret')));

  const config = new DocumentBuilder()
    .setTitle(configService.get('env.swagger_title'))
    .setDescription(configService.get('env.swagger_description'))
    .setVersion(configService.get('env.swagger_version'))
    .addTag('system')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
