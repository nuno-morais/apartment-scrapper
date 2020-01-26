import { Injectable } from '@nestjs/common';
import * as Crawler from 'crawler';
import { generate } from 'random-ua';

@Injectable()
export class CrawlerService {
    private crawler = new Crawler({
        maxConnections: 100,
        rotateUA: true,
        userAgent: [ generate(), generate(), generate(), generate(), generate(), generate() ],
    });

    public async call(url: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.crawler.queue({
                callback: (error, res, done) => {
                    done();
                    if (error) {
                        reject(error);
                    } else {
                        resolve(res);
                    }
                },
                uri: url,
            });
        });
    }
}
