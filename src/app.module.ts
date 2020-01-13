import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OlxModule } from './modules/olx/olx.module';
import { ImovirtualModule } from './modules/imovirtual/imovirtual.module';

@Module({
  imports: [OlxModule, ImovirtualModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
