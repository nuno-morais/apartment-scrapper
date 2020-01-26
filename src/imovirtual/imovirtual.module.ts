import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { ImovirtualScrapeInteractor } from './imovirtual.scrape.interactor';

@Module({
    exports: [ImovirtualScrapeInteractor],
    imports: [CommonModule],
    providers: [ImovirtualScrapeInteractor],
})
export class ImovirtualModule { }
