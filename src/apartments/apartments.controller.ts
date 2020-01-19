import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Apartment } from './apartment.entity';
import { GetApartmentsInteractor } from './interactors/getApartments.interactor';

@Controller('apartments')
export class ApartmentsController {
    constructor(
        private readonly getApartmentsInteractor: GetApartmentsInteractor,
    ) { }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    async getApartments(@Request() req): Promise<Apartment[]> {
        return await this.getApartmentsInteractor.call(req.user.userId);
    }
}
