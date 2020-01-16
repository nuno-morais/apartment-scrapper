import { Module } from '@nestjs/common';
import { LinksController } from './links.controller';
import { GetLinksInteractor } from './interactors/getLinks.interactor';
import { GetLinkInteractor } from './interactors/getLink.interactor';
import { DeleteLinkInteractor } from './interactors/deleteLink.interactor';
import { CreateLinkInteractor } from './interactors/createLink.interactor';
import { Link } from './link.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forFeature([Link]),
    ],
    controllers: [LinksController],
    providers: [
        GetLinksInteractor,
        GetLinkInteractor,
        DeleteLinkInteractor,
        CreateLinkInteractor],
})
export class LinksModule { }
