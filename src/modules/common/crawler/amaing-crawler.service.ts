import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class AmazingCrawlerService {
    public async call(url: string): Promise<any> {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle0' });
        const content = await page.content();
        return { content, page };
    }

    public async nextPage(page, target): Promise<any> {
        page.$eval(target, el => el.click()),
        await page.waitForNavigation({waitUntil: 'networkidle0'});
        const content = await page.content();
        return { content, page };
    }
}
