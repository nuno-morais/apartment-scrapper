import { Module } from '@nestjs/common';
import { ScrapeInteractor } from './scrape.interactor';
import { CrawlerService } from './crawler.service';

@Module({
    imports: [],
    providers: [ScrapeInteractor, CrawlerService],
    exports: [ScrapeInteractor],
})
export class OlxModule { }
