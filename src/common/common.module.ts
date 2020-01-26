import { Module } from '@nestjs/common';
import { AmazingCrawlerService } from './crawlers/amazing-crawler.service';
import { CrawlerService } from './crawlers/crawler.service';

@Module({
    exports: [CrawlerService, AmazingCrawlerService],
    providers: [CrawlerService, AmazingCrawlerService],
})
export class CommonModule { }
