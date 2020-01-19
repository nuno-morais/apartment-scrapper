import { Module } from '@nestjs/common';
import { OlxScrapeInteractor } from './olx.scrape.interactor';
import { CommonModule } from '../common/common.module';

@Module({
    imports: [CommonModule],
    providers: [OlxScrapeInteractor],
    exports: [OlxScrapeInteractor],
})
export class OlxModule { }
