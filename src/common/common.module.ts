import { Module } from '@nestjs/common';
import { CrawlerService } from './crawler/crawler.service';
import { AmazingCrawlerService } from './crawler/amazing-crawler.service';

@Module({
    imports: [],
    providers: [CrawlerService, AmazingCrawlerService],
    exports: [CrawlerService, AmazingCrawlerService],
})
export class CommonModule { }
