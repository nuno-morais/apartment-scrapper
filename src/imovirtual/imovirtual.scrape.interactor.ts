import { Injectable } from '@nestjs/common';
import { CrawlerService } from '../common/crawler/crawler.service';

@Injectable()
export class ImovirtualScrapeInteractor {
    public constructor(private crawlerService: CrawlerService) { }
    public async call(urls: string[]): Promise<any> {
        return Promise.all(
            urls.map(async (url) => {
                return await this.fetchData(url);
            }),
        ).then(result => result.reduce((acc, val) => acc.concat(val), []));
    }

    private async fetchData(url: string) {
        if (url == null || url === '') {
            return [];
        }
        const res = await this.crawlerService.call(url)
            .catch(error => {
                // tslint:disable-next-line: no-console
                console.log(`An error as occurred on scrapping page...`, error);
                return null;
            });

        if (res) {
            const data = this.handleResponse(res);
            return [...await this.fetchData(data.nextPage), ...data.result];
        } else {
            return [];
        }
    }

    private handleResponse(res) {
        const $ = res.$;
        const ads = $('.section-listing__row-content .offer-item');
        const result = [];
        ads.each((_, adsApartment) => {
            const title = $(adsApartment).find('.offer-item-title').first().text();
            const url = $(adsApartment).find('.offer-item-header a').first().attr('href');
            const img = $(adsApartment).find('.offer-item-image a span').first().attr('data-src');
            const price = $(adsApartment).find('.offer-item-price').first().text().trim();
            const adsId = $(adsApartment).find('.offer-item').first().attr('tracking-id');
            result.push({ title, url, price, img, adsId });
        });

        const nextPage = ($('.pager-next a').last() || { attr: () => null }).attr('href');
        return { result, nextPage };
    }
}
