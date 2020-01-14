import { Module } from '@nestjs/common';
import { RemaxScrapeInteractor } from './remax.scrape.interactor';
import { CommonModule } from '../common/common.module';

@Module({
    imports: [CommonModule],
    providers: [RemaxScrapeInteractor],
    exports: [RemaxScrapeInteractor],
})
export class RemaxModule { }
