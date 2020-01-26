import { AmazingCrawlerService } from './amazing-crawler.service';

export abstract class ScraperBrowserBase {
    public constructor(private amazingCrawlerService: AmazingCrawlerService) { }
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

        const res = await this.amazingCrawlerService.call(url)
            .catch(error => {
                // tslint:disable-next-line: no-console
                console.log(`An error as occurred on scrapping page...`, error);
                return null;
            });

        if (res) {
            const data = this.handleResponse(res);
            return [...await this.nextPage(data.nextPage, res.page, this.nextPageTarget(), res.browser), ...data.result];
        } else {
            return [];
        }
    }

    private async nextPage(shouldGo, page, target, browser) {
        if (shouldGo) {
            const res = await this.amazingCrawlerService.nextPage(page, target, browser)
                .catch(error => {
                    // tslint:disable-next-line: no-console
                    console.log(`An error as occurred on scrapping page...`, error);
                    return null;
                });

            if (res) {
                const data = this.handleResponse(res);
                return [...await this.nextPage(data.nextPage, res.page, this.nextPageTarget(), res.browser), ...data.result];
            } else {
                return [];
            }
        } else {
            this.amazingCrawlerService.close(browser);
            return [];
        }
    }

    protected abstract nextPageTarget(): string;

    protected abstract handleResponse(rest): any;
}