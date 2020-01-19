import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { LinksModule } from './links/links.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from './links/link.entity';
import { ApartmentsModule } from './apartments/apartments.module';
import 'dotenv/config';
import { Apartment } from './apartments/apartment.entity';

const options = {
  type: process.env.TYPEORM_CONNECTION as any,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  database: process.env.TYPEORM_DATABASE,
  entities: [Link, Apartment],
  synchronize: process.env.TYPEORM_SYNCHRONIZE as unknown as boolean,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  useUnifiedTopology: true,
};
@Module({
  imports: [
    TypeOrmModule.forRoot(options),
    AuthModule, LinksModule, ApartmentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
