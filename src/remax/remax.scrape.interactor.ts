import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { AmazingCrawlerService } from '../common/crawlers/amazing-crawler.service';
import { ScraperBrowserBase } from '../common/crawlers/scraper.browser.base';

@Injectable()
export class RemaxScrapeInteractor extends ScraperBrowserBase {
    public constructor(crawlerService: AmazingCrawlerService) {
        super(crawlerService);
    }

    protected nextPageTarget(): string {
        return '.pagination>li:last-child>a';
    }

    protected handleResponse(res) {
        const $ = cheerio.load(res.content);
        const ads = $('.gallery-item-container');
        const result = [];

        ads.each((_, adsApartment) => {
            const title = `${$(adsApartment).attr('id')} ${$(adsApartment).find('.gallery-title a').first().text()}`;
            const url = `http://remax.pt/` + $(adsApartment).find('.gallery-title a').first().attr('href');
            const img = $(adsApartment).find('.gallery-share-compare .control-checkbox input').first().attr('data-thumbnail');
            const price = $(adsApartment).find('.proplist_price').first().text();
            const adsId = $(adsApartment).attr('id');
            result.push({ title, url, price, img, adsId });
        });

        const nextPage = $('.disablednav .page-next').length === 0;
        return { result, nextPage };
    }
}
