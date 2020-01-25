import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    exposedHeaders: ['X-Total-Count'],
  });
  app.use(morgan('combined'));
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));
  const defaultPort = 3001;
  const port: any = process.env.PORT || defaultPort;
  // tslint:disable-next-line: no-console
  console.log(`Starting server on :${port}`);
  await app.listen(port, () => {
    // tslint:disable-next-line
    console.log(`Server is listening on port ${port}.`);
  }).catch((error) => {
    // tslint:disable-next-line: no-console
    console.error(`An error occurred when the server was starting...`, error);
  });
}
bootstrap();
