import { Controller, Get } from '@nestjs/common';
import { OlxScrapeInteractor } from './modules/olx/olx.scrape.interactor';
import { ImovirtualModule } from './modules/imovirtual/imovirtual.module';
import { ImovirtualScrapeInteractor } from './modules/imovirtual/imovirtual.scrape.interactor';

@Controller()
export class AppController {
  constructor(
    private readonly olxScrapeInteractor: OlxScrapeInteractor,
    private readonly imovirtualScrapeInterector: ImovirtualScrapeInteractor) { }

  @Get()
  async getHello(): Promise<any> {
    const result = await this.olxScrapeInteractor.call(
      ['https://www.olx.pt/imoveis/apartamento-casa-a-venda/apartamentos-venda/paranhos/?search%5Bfilter_float_price%3Ato%5D=240000&search%5Bfilter_enum_tipologia%5D%5B0%5D=t3&search%5Bfilter_enum_tipologia%5D%5B1%5D=t4&search%5Bfilter_enum_tipologia%5D%5B2%5D=t5&search%5Bfilter_enum_tipologia%5D%5B3%5D=t6&search%5Bfilter_enum_tipologia%5D%5B4%5D=t7&search%5Bfilter_enum_tipologia%5D%5B5%5D=t8&search%5Bfilter_enum_tipologia%5D%5B6%5D=t9&search%5Bfilter_enum_tipologia%5D%5B7%5D=t10-ou-superior&search%5Bdescription%5D=1&search%5Bprivate_business%5D=private']
    );
    const result2 = await this.imovirtualScrapeInterector.call(
      ['https://www.imovirtual.com/comprar/apartamento/?search%5Bfilter_float_price%3Afrom%5D=150000&search%5Bfilter_float_price%3Ato%5D=250000&search%5Bfilter_enum_rooms_num%5D%5B0%5D=3&search%5Bfilter_enum_rooms_num%5D%5B1%5D=4&search%5Bdescription%5D=1&locations%5B0%5D%5Bregion_id%5D=13&locations%5B0%5D%5Bsubregion_id%5D=182&locations%5B0%5D%5Bcity_id%5D=13635592&locations%5B1%5D%5Bregion_id%5D=13&locations%5B1%5D%5Bsubregion_id%5D=182&locations%5B1%5D%5Bcity_id%5D=13635596']
    )
    return [...result, ...result2];
    // return this.appService.getHello();
  }
}
