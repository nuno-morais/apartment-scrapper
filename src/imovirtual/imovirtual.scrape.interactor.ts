import { Injectable } from '@nestjs/common';
import { CrawlerService } from '../common/crawlers/crawler.service';
import { ScraperBase } from '../common/crawlers/scraper.base';

@Injectable()
export class ImovirtualScrapeInteractor extends ScraperBase {
    public constructor(crawlerService: CrawlerService) {
        super(crawlerService);
    }

    protected handleResponse(res) {
        const $ = res.$;
        const ads = $('.section-listing__row-content .offer-item');
        const result = [];
        ads.each((_, adsApartment) => {
            const title = $(adsApartment).find('.offer-item-title').first().text();
            const url = $(adsApartment).find('.offer-item-header a').first().attr('href');
            const img = $(adsApartment).find('.offer-item-image a span').first().attr('data-src');
            const price = $(adsApartment).find('.offer-item-price').first().text().trim();
            const adsId = $(adsApartment).attr('data-tracking-id');
            result.push({ title, url, price, img, adsId });
        });

        const nextPage = ($('.pager-next a').last() || { attr: () => null }).attr('href');
        return { result, nextPage };
    }
}
