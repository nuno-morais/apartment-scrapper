import { Controller, Get, HttpStatus, Param, Post, Query, Request, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { QueryOptions } from '../common/Queries/query-options';
import { Apartment } from './apartment.entity';
import { FavoriteApartmentInteractor } from './interactors/favoriteApartment.interactor';
import { GetApartmentsInteractor } from './interactors/getApartments.interactor';
import { HideApartmentInteractor } from './interactors/hideApartment.interactor';

@Controller('apartments')
export class ApartmentsController {
    constructor(
        private readonly getApartmentsInteractor: GetApartmentsInteractor,
        private readonly hideApartmentInteractor: HideApartmentInteractor,
        private readonly favoriteApartmentInteractor: FavoriteApartmentInteractor,
    ) { }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    public async getApartments(@Request() req, @Res() res, @Query() query: QueryOptions): Promise<Apartment[]> {
        const result = await this.getApartmentsInteractor.call(req.user.userId, false, query);
        res.set({ 'X-Total-Count': result[1] });
        res.status(HttpStatus.OK).send(result[0]);
        return result[0];
    }

    @UseGuards(AuthGuard('jwt'))
    @Post(':id/actions/hide')
    public async hideApartments(@Request() req, @Param('id') id): Promise<Apartment> {
        return await this.hideApartmentInteractor.call(id, req.user.userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post(':id/actions/favorite')
    public async favoriteApartments(@Request() req, @Param('id') id): Promise<Apartment> {
        return await this.favoriteApartmentInteractor.call(id, req.user.userId);
    }
}
