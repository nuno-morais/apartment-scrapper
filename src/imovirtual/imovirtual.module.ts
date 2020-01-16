import { Module } from '@nestjs/common';
import { ImovirtualScrapeInteractor } from './imovirtual.scrape.interactor';
import { CommonModule } from '../common/common.module';

@Module({
    imports: [CommonModule],
    providers: [ImovirtualScrapeInteractor],
    exports: [ImovirtualScrapeInteractor],
})
export class ImovirtualModule { }
