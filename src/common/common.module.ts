import { Module } from '@nestjs/common';
import { AmazingCrawlerService } from './crawler/amazing-crawler.service';
import { CrawlerService } from './crawler/crawler.service';

@Module({
    exports: [CrawlerService, AmazingCrawlerService],
    providers: [CrawlerService, AmazingCrawlerService],
})
export class CommonModule { }
