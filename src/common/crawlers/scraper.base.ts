import { CrawlerService } from './crawler.service';

export abstract class ScraperBase {
    public constructor(private crawlerService: CrawlerService) { }

    public async call(urls: string[]): Promise<any> {
        return Promise.all(
            urls.map(async (url) => {
                return await this.fetchData(url);
            }),
        ).then(result => result.reduce((acc, val) => acc.concat(val), []));
    }

    protected async fetchData(url: string) {
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

    protected abstract handleResponse(rest): any;
}