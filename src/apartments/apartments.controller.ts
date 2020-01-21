import { Controller, Get, UseGuards, Request, Post, Param, Query, Res, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Apartment } from './apartment.entity';
import { GetApartmentsInteractor } from './interactors/getApartments.interactor';
import { HideApartmentInteractor } from './interactors/hideApartment.interactor';
import { QueryOptions } from '../common/Queries/query-options';

@Controller('apartments')
export class ApartmentsController {
    constructor(
        private readonly getApartmentsInteractor: GetApartmentsInteractor,
        private readonly hideApartmentInteractor: HideApartmentInteractor,
    ) { }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    async getApartments(@Request() req, @Res() res, @Query() query: QueryOptions): Promise<Apartment[]> {
        const result = await this.getApartmentsInteractor.call(req.user.userId, false, query);
        res.set({ 'X-Total-Count': result[1] });
        res.status(HttpStatus.OK).send(result[0]);
        return result[0];
    }

    @UseGuards(AuthGuard('jwt'))
    @Post(':id/actions/hide')
    async hideApartments(@Request() req, @Param('id') id): Promise<Apartment> {
        return await this.hideApartmentInteractor.call(id, req.user.userId);
    }
}
