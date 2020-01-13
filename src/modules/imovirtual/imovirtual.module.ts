import { Module } from '@nestjs/common';
import { ImovirtualScrapeInteractor } from './imovirtual.scrape.interactor';
import { CrawlerService } from './crawler.service';

@Module({
    imports: [],
    providers: [ImovirtualScrapeInteractor, CrawlerService],
    exports: [ImovirtualScrapeInteractor],
})
export class ImovirtualModule { }
