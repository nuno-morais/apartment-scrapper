import { Controller, Get, UseGuards, Request, Post, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Apartment } from './apartment.entity';
import { GetApartmentsInteractor } from './interactors/getApartments.interactor';
import { HideApartmentInteractor } from './interactors/hideApartment.interactor';

@Controller('apartments')
export class ApartmentsController {
    constructor(
        private readonly getApartmentsInteractor: GetApartmentsInteractor,
        private readonly hideApartmentInteractor: HideApartmentInteractor,
    ) { }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    async getApartments(@Request() req): Promise<Apartment[]> {
        return await this.getApartmentsInteractor.call(req.user.userId)
            .then(result => result.filter(q => q.isHidden == null || q.isHidden === false));
    }

    @UseGuards(AuthGuard('jwt'))
    @Post(':id/actions/hide')
    async hideApartments(@Request() req, @Param('id') id): Promise<Apartment> {
        return await this.hideApartmentInteractor.call(id, req.user.userId);
    }
}
