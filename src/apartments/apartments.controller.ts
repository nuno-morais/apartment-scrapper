import { Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Request, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { QueryOptions } from '../common/queries/query-options';
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

    @HttpCode(200)
    @UseGuards(AuthGuard('jwt'))
    @Post(':id/actions/hide')
    public async hideApartment(@Request() req, @Param('id') id): Promise<Apartment> {
        return await this.hideApartmentInteractor.call(id, req.user.userId);
    }

    @HttpCode(200)
    @UseGuards(AuthGuard('jwt'))
    @Post(':id/actions/favorite')
    public async favoriteApartment(@Request() req, @Param('id') id): Promise<Apartment> {
        return await this.favoriteApartmentInteractor.call(id, req.user.userId);
    }

    @HttpCode(200)
    @UseGuards(AuthGuard('jwt'))
    @Post(':id/actions/show')
    public async showApartment(@Request() req, @Param('id') id): Promise<Apartment> {
        return await this.hideApartmentInteractor.call(id, req.user.userId, false);
    }

    @HttpCode(200)
    @UseGuards(AuthGuard('jwt'))
    @Post(':id/actions/nonfavorite')
    public async nonFavoriteApartments(@Request() req, @Param('id') id): Promise<Apartment> {
        return await this.favoriteApartmentInteractor.call(id, req.user.userId, false);
    }
}
