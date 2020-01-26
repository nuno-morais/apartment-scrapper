import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { RemaxScrapeInteractor } from './remax.scrape.interactor';

@Module({
    exports: [RemaxScrapeInteractor],
    imports: [CommonModule],
    providers: [RemaxScrapeInteractor],
})
export class RemaxModule { }
