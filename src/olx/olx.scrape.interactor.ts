import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { CrawlerService } from '../common/crawler/crawler.service';

@Injectable()
export class OlxScrapeInteractor {
    public constructor(private crawlerService: CrawlerService) { }
    public async call(urls: string[]): Promise<any> {
        return Promise.all(
            urls.map(async (url) => {
                return await this.fetchData(url);
            }),
        ).then(result => result.reduce((acc, val) => acc.concat(val), []));
    }

    private async fetchData(url: string) {
        if (url == null) {
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
        const ads = $('.offer-wrapper');
        const result = [];

        ads.each((_, adsApartment) => {
            const title = $(adsApartment).find('.lheight22 strong').first().text();
            const url = $(adsApartment).find('.lheight22 a').first().attr('href');
            const img = $(adsApartment).find('img').first().attr('src');
            const price = $(adsApartment).find('.space.inlblk.rel strong').first().text();
            const timeString = $(adsApartment).find('.lheight16 .breadcrumb span').last().text();
            const time = this.parseDate(timeString.trim().replace(/  /g, ' '));
            result.push({ title, url, price, img, time });
        });

        const nextPage = $('.pageNextPrev').last().attr('href');
        return { result, nextPage };
    }

    private months = {
        Jan: 0,
        Fev: 1,
        Mar: 2,
        Abr: 3,
        Mai: 4,
        Jun: 5,
        Jul: 6,
        Ago: 7,
        Set: 8,
        Out: 9,
        Nov: 10,
        Dez: 11,
    };
    private parseDate(timeString: string): Date {
        if (timeString.startsWith('hoje')) {
            return new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
        } else if (timeString.startsWith('ontem')) {
            const yesterday = moment().subtract(1, 'days').toDate();
            return new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
        } else {
            const m = timeString.split(' ');
            const currentMonth = new Date().getMonth();
            if (currentMonth <= this.months[m[0]]) {
                return new Date(new Date().getFullYear(), this.months[m[1]], parseInt(m[0], 10));
            } else {
                return new Date(new Date().getFullYear() - 1, this.months[m[1]], parseInt(m[0], 10));
            }
        }
    }
}
