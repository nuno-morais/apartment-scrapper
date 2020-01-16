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
    console.log(req.user)
    const result = await this.olxScrapeInteractor.call(
      ['https://www.olx.pt/imoveis/apartamento-casa-a-venda/apartamentos-venda/paranhos/?search%5Bfilter_float_price%3Ato%5D=240000&search%5Bfilter_enum_tipologia%5D%5B0%5D=t3&search%5Bfilter_enum_tipologia%5D%5B1%5D=t4&search%5Bfilter_enum_tipologia%5D%5B2%5D=t5&search%5Bfilter_enum_tipologia%5D%5B3%5D=t6&search%5Bfilter_enum_tipologia%5D%5B4%5D=t7&search%5Bfilter_enum_tipologia%5D%5B5%5D=t8&search%5Bfilter_enum_tipologia%5D%5B6%5D=t9&search%5Bfilter_enum_tipologia%5D%5B7%5D=t10-ou-superior&search%5Bdescription%5D=1&search%5Bprivate_business%5D=private']
    );
    // const result2 = await this.imovirtualScrapeInterector.call(
    //   ['https://www.imovirtual.com/comprar/apartamento/?search%5Bfilter_float_price%3Afrom%5D=150000&search%5Bfilter_float_price%3Ato%5D=250000&search%5Bfilter_enum_rooms_num%5D%5B0%5D=3&search%5Bfilter_enum_rooms_num%5D%5B1%5D=4&search%5Bdescription%5D=1&locations%5B0%5D%5Bregion_id%5D=13&locations%5B0%5D%5Bsubregion_id%5D=182&locations%5B0%5D%5Bcity_id%5D=13635592&locations%5B1%5D%5Bregion_id%5D=13&locations%5B1%5D%5Bsubregion_id%5D=182&locations%5B1%5D%5Bcity_id%5D=13635596']
    // )
    // const result2 = await this.remaxScrapeInterector.call(
    //   ["https://www.remax.pt/PublicListingList.aspx#mode=gallery&tt=261&cr=2&mpts=359,363,364,365,366,369,525&pt=359&cur=EUR&b=3&e=2844&sb=PriceIncreasing&page=1&sc=12&rl=78&pm=564&cll=138346,7881295,7881318,7881348&lsgeo=78,564,138346,0&sid=a81a1d1d-ee36-4236-a72e-31343349c574"]
    // )
    return [...result];
  }
}
