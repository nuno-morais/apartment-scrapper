import { Injectable } from '@nestjs/common';
import { Apartment } from '../apartment.entity';
import { GetLinksInteractor } from '../../links/interactors/getLinks.interactor';
import { OlxScrapeInteractor } from '../../olx/olx.scrape.interactor';
import { RemaxScrapeInteractor } from '../../remax/remax.scrape.interactor';
import { ImovirtualScrapeInteractor } from '../../imovirtual/imovirtual.scrape.interactor';
import { GetApartmentsInteractor } from './getApartments.interactor';
import { ApartmentMetadata } from '../apartment-metada';
import { CreateApartmentInteractor } from './createApartment.interactor';

@Injectable()
export class TriggerScrapersInteractor {
    private readonly REMAX = 'REMAX';
    private readonly OLX = 'OLX';
    private readonly IMOVIRTUAL = 'IMOVIRTUAL';

    constructor(
        private readonly createApartmentInteractor: CreateApartmentInteractor,
        private readonly getApartmentsInteractor: GetApartmentsInteractor,
        private readonly getLinksInteractor: GetLinksInteractor,
        private readonly olxScrapeInteractor: OlxScrapeInteractor,
        private readonly remaxScrapeInteractor: RemaxScrapeInteractor,
        private readonly imovirtualScrapeInteractor: ImovirtualScrapeInteractor,
    ) { }

    public async call(userId: string): Promise<void> {
        setTimeout(async () => {
            const links = await this.getLinksInteractor.call(userId);
            let apartments = [];
            for (const link of links) {
                apartments = [...apartments, ... await this.scrapeLink(link)];
            }
            this.mergeApartments(apartments, userId);
        }, 0);
    }

    private async scrapeLink(link): Promise<ApartmentMetadata[]> {
        if (link.provider === this.REMAX) {
            return await this.remaxScrapeInteractor.call([link.url])
                .then(result => result.map(r => (new ApartmentMetadata({ ...r, provider: this.REMAX }))));
        } else if (link.provider === this.OLX) {
            return await this.olxScrapeInteractor.call([link.url])
                .then(result => result.map(r => (new ApartmentMetadata({ ...r, provider: this.OLX }))));
        } else if (link.provider === this.IMOVIRTUAL) {
            return await this.imovirtualScrapeInteractor.call([link.url])
                .then(result => result.map(r => (new ApartmentMetadata({ ...r, provider: this.IMOVIRTUAL }))));
        }
    }

    private async mergeApartments(metaApartments: ApartmentMetadata[], userId: string): Promise<void> {
        const storedApartments = await this.getApartmentsInteractor.call(userId);
        for (const apartment of metaApartments) {
            const existApartment = storedApartments.find(q => q.title === apartment.title);
            if (!existApartment) {
                const newApartment = new Apartment();
                newApartment.ads = [apartment];
                newApartment.image = apartment.img;
                newApartment.title = apartment.title;
                newApartment.price = apartment.price;
                await this.createApartmentInteractor.call(newApartment, userId);
                storedApartments.push(newApartment);
            }
        }
    }
}
