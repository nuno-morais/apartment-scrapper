import { Injectable } from '@nestjs/common';
import * as Crawler from 'crawler';

@Injectable()
export class CrawlerService {
    private crawler = new Crawler({
        maxConnections: 1,
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
    });

    public async call(url: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.crawler.queue({
                uri: url,
                callback: (error, res, done) => {
                    done();
                    if (error) {
                        reject(error);
                    } else {
                        resolve(res);
                    }
                },
            });
        });
    }
}
