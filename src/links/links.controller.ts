import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Query, Request, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { QueryOptions } from '../common/queries/query-options';
import { CreateLinkInteractor } from './interactors/createLink.interactor';
import { DeleteLinkInteractor } from './interactors/deleteLink.interactor';
import { GetLinkInteractor } from './interactors/getLink.interactor';
import { GetLinksInteractor } from './interactors/getLinks.interactor';
import { Link } from './link.entity';

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
    public async getLinks(@Request() req, @Res() res, @Query() query: QueryOptions): Promise<Link[]> {
        const result = await this.getLinksInteractor.call(req.user.userId, query);
        res.set({ 'X-Total-Count': result[1] });
        res.status(HttpStatus.OK).send(result[0]);
        return result[0];
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    public async getLink(
        @Request() req,
        @Param('id') id: string): Promise<Link> {
        return this.getLinkInteractor.call(id, req.user.userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    public async createLink(@Request() req, @Body() entity: Link): Promise<Link> {
        return this.createLinkInteractor.call(entity, req.user.userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    public async deleteLink(
        @Request() req,
        @Param('id') id: string): Promise<void> {
        return this.deleteLinkInteractor.call(id, req.user.userId);
    }
}
