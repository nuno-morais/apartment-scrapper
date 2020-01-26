import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateLinkInteractor } from './interactors/createLink.interactor';
import { DeleteLinkInteractor } from './interactors/deleteLink.interactor';
import { GetLinkInteractor } from './interactors/getLink.interactor';
import { GetLinksInteractor } from './interactors/getLinks.interactor';
import { Link } from './link.entity';
import { LinksController } from './links.controller';

@Module({
    controllers: [LinksController],
    exports: [GetLinksInteractor],
    imports: [
        TypeOrmModule.forFeature([Link]),
    ],
    providers: [
        GetLinksInteractor,
        GetLinkInteractor,
        DeleteLinkInteractor,
        CreateLinkInteractor],
})
export class LinksModule { }
