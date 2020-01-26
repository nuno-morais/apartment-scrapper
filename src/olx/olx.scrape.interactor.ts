import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { CrawlerService } from '../common/crawlers/crawler.service';
import { ScraperBase } from '../common/crawlers/scraper.base';

@Injectable()
export class OlxScrapeInteractor extends ScraperBase {
    private months = {
        // tslint:disable-next-line: object-literal-sort-keys
        Jan: 0, Fev: 1, Mar: 2, Abr: 3, Mai: 4, Jun: 5,
        Jul: 6, Ago: 7, Set: 8, Out: 9, Nov: 10, Dez: 11,
    };

    private readonly TODAY = 'hoje';
    private readonly YESTERDAY = 'ontem';
    private readonly DAYS = 'days';

    public constructor(crawlerService: CrawlerService) {
        super(crawlerService);
    }

    protected handleResponse(res) {
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
            const adsId = $(adsApartment).find('table').first().attr('data-id');
            result.push({ title, url, price, img, time, adsId });
        });

        const nextPage = $('.pageNextPrev').last().attr('href');
        return { result, nextPage };
    }
    private parseDate(timeString: string): Date {
        if (timeString.startsWith(this.TODAY)) {
            return this.today();
        } else if (timeString.startsWith(this.YESTERDAY)) {
            return this.yesterday();
        } else {
            return this.createDayFromString(timeString);
        }
    }

    private today(): Date {
        const todayDate = new Date();
        return new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());
    }

    private yesterday(): Date {
        const yesterday = moment().subtract(1, this.DAYS).toDate();
        return new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
    }

    private createDayFromString(timeString: string): Date {
        const m = timeString.split(' ');
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        if (currentMonth <= this.months[m[0]]) {
            return new Date(currentYear, this.months[m[1]], parseInt(m[0], 10));
        } else {
            return new Date(currentYear - 1, this.months[m[1]], parseInt(m[0], 10));
        }
    }
}
