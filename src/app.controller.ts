import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { OlxScrapeInteractor } from './olx/olx.scrape.interactor';
import { ImovirtualScrapeInteractor } from './imovirtual/imovirtual.scrape.interactor';
import { RemaxScrapeInteractor } from './remax/remax.scrape.interactor';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  constructor(
    private readonly olxScrapeInteractor: OlxScrapeInteractor,
    private readonly imovirtualScrapeInterector: ImovirtualScrapeInteractor,
    private readonly remaxScrapeInterector: RemaxScrapeInteractor,
  ) { }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getHello(@Request() req): Promise<any> {
    return [];
  }
}
