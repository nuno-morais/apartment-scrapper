import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { OlxScrapeInteractor } from './olx.scrape.interactor';

@Module({
    exports: [OlxScrapeInteractor],
    imports: [CommonModule],
    providers: [OlxScrapeInteractor],
})
export class OlxModule { }
