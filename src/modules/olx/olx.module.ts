import { Module } from '@nestjs/common';
import { OlxScrapeInteractor } from './olx.scrape.interactor';
import { CrawlerService } from './crawler.service';

@Module({
    imports: [],
    providers: [OlxScrapeInteractor, CrawlerService],
    exports: [OlxScrapeInteractor],
})
export class OlxModule { }
