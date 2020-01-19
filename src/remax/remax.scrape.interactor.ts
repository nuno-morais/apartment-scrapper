import { Injectable } from '@nestjs/common';
import { AmazingCrawlerService } from '../common/crawler/amazing-crawler.service';
import * as cheerio from 'cheerio';

@Injectable()
export class RemaxScrapeInteractor {
    public constructor(private crawlerService: AmazingCrawlerService) { }
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
            return [...await this.nextPage(data.nextPage, res.page, '.ajax-page-link', res.browser), ...data.result];
        } else {
            return [];
        }
    }

    private async nextPage(shouldGo, page, target, browser) {
        if (shouldGo) {
            const res = await this.crawlerService.nextPage(page, target, browser)
                .catch(error => {
                    // tslint:disable-next-line: no-console
                    console.log(`An error as occurred on scrapping page...`, error);
                    return null;
                });

            if (res) {
                const data = this.handleResponse(res);
                return [...await this.nextPage(data.nextPage, res.page, '.ajax-page-link',  res.browser), ...data.result];
            } else {
                return [];
            }
        } else {
            this.crawlerService.close(browser);
            return [];
        }
    }

    private handleResponse(res) {
        const $ = cheerio.load(res.content);
        const ads = $('.gallery-item-container');
        const result = [];

        ads.each((_, adsApartment) => {
            const title = `${$(adsApartment).attr('id')} ${$(adsApartment).find('.gallery-title a').first().text()}`;
            const url = `http://remax.pt/` + $(adsApartment).find('.gallery-title a').first().attr('href');
            const img = $(adsApartment).find('.gallery-share-compare .control-checkbox input').first().attr('data-thumbnail');
            const price = $(adsApartment).find('.proplist_price').first().text();
            result.push({ title, url, price, img });
        });

        const nextPage = false; // $('.disablednav.pag-next').length === 0;
        return { result, nextPage };
    }
}
