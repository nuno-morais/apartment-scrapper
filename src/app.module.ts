import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OlxModule } from './modules/olx/olx.module';
import { ImovirtualModule } from './modules/imovirtual/imovirtual.module';
import { RemaxModule } from './modules/remax/remax.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [OlxModule, ImovirtualModule, RemaxModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
