import { Controller, Get } from '@nestjs/common';
import { ScrapeInteractor } from './modules/olx/scrape.interactor';

@Controller()
export class AppController {
  constructor(
    private readonly scrapeInteractor: ScrapeInteractor) { }

  @Get()
  async getHello(): Promise<any> {
    const result = await this.scrapeInteractor.call(
      ['https://www.olx.pt/imoveis/apartamento-casa-a-venda/apartamentos-venda/paranhos/?search%5Bfilter_float_price%3Ato%5D=240000&search%5Bfilter_enum_tipologia%5D%5B0%5D=t3&search%5Bfilter_enum_tipologia%5D%5B1%5D=t4&search%5Bfilter_enum_tipologia%5D%5B2%5D=t5&search%5Bfilter_enum_tipologia%5D%5B3%5D=t6&search%5Bfilter_enum_tipologia%5D%5B4%5D=t7&search%5Bfilter_enum_tipologia%5D%5B5%5D=t8&search%5Bfilter_enum_tipologia%5D%5B6%5D=t9&search%5Bfilter_enum_tipologia%5D%5B7%5D=t10-ou-superior&search%5Bdescription%5D=1&search%5Bprivate_business%5D=private']
    );
    return result;
    // return this.appService.getHello();
  }
}
