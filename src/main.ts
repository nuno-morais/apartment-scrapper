import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as audit from 'express-requests-logger';
import * as bunyan from 'bunyan';
import * as pretty from '@mechanicalhuman/bunyan-pretty';
import * as cors from 'cors';
import { ResponseHeadersInterceptor } from './common/interceptors/ResponseHeadersInterceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(cors({
    exposedHeaders: ['X-Total-Count'],
  }));
  const logger = bunyan.createLogger({
    name: 'app',
    stream: pretty(process.stdout, { timeStamps: false }),
    level: 'info',
  });
  app.use(audit({
    logger,
    request: {
      excludeHeaders: ['authorization'],
      maxBodyLength: 200,
    },
    response: {
      maskBody: ['session_token'],
      maxBodyLength: 200,
    },
  }));
  app.useGlobalInterceptors(new ResponseHeadersInterceptor());
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));
  const defaultPort = 3001;
  const port: any = process.env.PORT || defaultPort;
  await app.listen(port, () => {
    // tslint:disable-next-line
    console.log(`Server is listening on port ${port}.`);
  }).catch((error) => {
    // tslint:disable-next-line: no-console
    console.error(`An error occurred when the server was starting...`, error);
  });
}
bootstrap();
