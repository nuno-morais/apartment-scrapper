import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TriggerScrapersInteractor } from './interactors/triggerScrapers.interactor';

@Controller('apartment-trigger')
export class ApartmentTriggerController {
    constructor(
        private readonly triggerScrapersInteractor: TriggerScrapersInteractor,
    ) { }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    public async getApartments(@Request() req): Promise<void> {
        this.triggerScrapersInteractor.call(req.user.userId);
        return null;
    }
}
