import { Controller, Get, UseGuards, Request, Param, Post, Body, Delete, Query, Res, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Link } from './link.entity';
import { GetLinksInteractor } from './interactors/getLinks.interactor';
import { GetLinkInteractor } from './interactors/getLink.interactor';
import { CreateLinkInteractor } from './interactors/createLink.interactor';
import { DeleteLinkInteractor } from './interactors/deleteLink.interactor';
import { QueryOptions } from './../common/Queries/query-options';

@Controller('links')
export class LinksController {
    constructor(
        private getLinksInteractor: GetLinksInteractor,
        private getLinkInteractor: GetLinkInteractor,
        private createLinkInteractor: CreateLinkInteractor,
        private deleteLinkInteractor: DeleteLinkInteractor,
    ) { }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    async getLinks(@Request() req, @Res() res, @Query() query: QueryOptions): Promise<Link[]> {
        const result = await this.getLinksInteractor.call(req.user.userId, query);
        res.set({ 'X-Total-Count': result[1] });
        res.status(HttpStatus.OK).send(result[0]);
        return result[0];
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    async getLink(
        @Request() req,
        @Param('id') id: string): Promise<Link> {
        return this.getLinkInteractor.call(id, req.user.userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async createLink(@Request() req, @Body() entity: Link): Promise<Link> {
        return this.createLinkInteractor.call(entity, req.user.userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    async deleteLink(
        @Request() req,
        @Param('id') id: string): Promise<void> {
        return this.deleteLinkInteractor.call(id, req.user.userId);
    }
}
