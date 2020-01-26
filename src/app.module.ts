import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import 'dotenv/config';
import { Apartment } from './apartments/apartment.entity';
import { ApartmentsModule } from './apartments/apartments.module';
import { AuthModule } from './auth/auth.module';
import { Link } from './links/link.entity';
import { LinksModule } from './links/links.module';

const options = {
  database: process.env.TYPEORM_DATABASE,
  entities: [Link, Apartment],
  host: process.env.TYPEORM_HOST,
  password: process.env.TYPEORM_PASSWORD,
  port: process.env.TYPEORM_PORT,
  synchronize: process.env.TYPEORM_SYNCHRONIZE as unknown as boolean,
  type: process.env.TYPEORM_CONNECTION as any,
  useUnifiedTopology: true,
  username: process.env.TYPEORM_USERNAME,
};
@Module({
  imports: [
    TypeOrmModule.forRoot(options),
    AuthModule, LinksModule, ApartmentsModule],
})
export class AppModule { }
