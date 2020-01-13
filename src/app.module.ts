import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OlxModule } from './modules/olx/olx.module';

@Module({
  imports: [OlxModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
