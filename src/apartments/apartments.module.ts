import { Module } from '@nestjs/common';
import { ApartmentsController } from './apartments.controller';
import { ImovirtualModule } from '../imovirtual/imovirtual.module';
import { OlxModule } from '../olx/olx.module';
import { RemaxModule } from '../remax/remax.module';
import { CreateApartmentInteractor } from './interactors/createApartment.interactor';
import { GetApartmentsInteractor } from './interactors/getApartments.interactor';
import { GetApartmentInteractor } from './interactors/getApartment.interactor';
import { TriggerScrapersInteractor } from './interactors/triggerScrapers.interactor';
import { Apartment } from './apartment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinksModule } from '../links/links.module';
import { ApartmentTriggerController } from './apartment-trigger.controller';
import { HideApartmentInteractor } from './interactors/hideApartment.interactor';

@Module({
  controllers: [ApartmentsController, ApartmentTriggerController],
  imports: [TypeOrmModule.forFeature([Apartment]), LinksModule, OlxModule, ImovirtualModule, RemaxModule],
  providers: [CreateApartmentInteractor, GetApartmentsInteractor,
    GetApartmentInteractor, TriggerScrapersInteractor, HideApartmentInteractor]
})
export class ApartmentsModule { }
