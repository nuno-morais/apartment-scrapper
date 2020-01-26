import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImovirtualModule } from '../imovirtual/imovirtual.module';
import { LinksModule } from '../links/links.module';
import { OlxModule } from '../olx/olx.module';
import { RemaxModule } from '../remax/remax.module';
import { ApartmentTriggerController } from './apartment-trigger.controller';
import { Apartment } from './apartment.entity';
import { ApartmentsController } from './apartments.controller';
import { CreateApartmentInteractor } from './interactors/createApartment.interactor';
import { FavoriteApartmentInteractor } from './interactors/favoriteApartment.interactor';
import { GetApartmentInteractor } from './interactors/getApartment.interactor';
import { GetApartmentsInteractor } from './interactors/getApartments.interactor';
import { HideApartmentInteractor } from './interactors/hideApartment.interactor';
import { TriggerScrapersInteractor } from './interactors/triggerScrapers.interactor';

@Module({
  controllers: [ApartmentsController, ApartmentTriggerController],
  imports: [TypeOrmModule.forFeature([Apartment]), LinksModule, OlxModule, ImovirtualModule, RemaxModule],
  providers: [CreateApartmentInteractor, GetApartmentsInteractor,
    GetApartmentInteractor, TriggerScrapersInteractor, HideApartmentInteractor, FavoriteApartmentInteractor],
})
export class ApartmentsModule { }
