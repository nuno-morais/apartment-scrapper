import { Injectable } from '@nestjs/common';
import { ImovirtualScrapeInteractor } from '../../imovirtual/imovirtual.scrape.interactor';
import { GetLinksInteractor } from '../../links/interactors/getLinks.interactor';
import { OlxScrapeInteractor } from '../../olx/olx.scrape.interactor';
import { RemaxScrapeInteractor } from '../../remax/remax.scrape.interactor';
import { ApartmentMetadata } from '../apartment-metada.entity';
import { Apartment } from '../apartment.entity';
import { CreateApartmentInteractor } from './createApartment.interactor';
import { GetApartmentsInteractor } from './getApartments.interactor';

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
            const links = (await this.getLinksInteractor.call(userId))[0];
            for (const link of links) {
                const apartmentsScrapped = await this.scrapeLink(link);
                this.mergeApartments(apartmentsScrapped, userId);
            }
        }, 0);
    }

    private async scrapeLink(link): Promise<ApartmentMetadata[]> {
        if (link.provider === this.REMAX) {
            return await this.remaxScrapeInteractor.call([link.url])
                .then(result => result.map(r => (new ApartmentMetadata({ ...r, provider: this.REMAX }))))
                .catch(error => this.handleError(error, link, this.REMAX));
        } else if (link.provider === this.OLX) {
            return await this.olxScrapeInteractor.call([link.url])
                .then(result => result.map(r => (new ApartmentMetadata({ ...r, provider: this.OLX }))))
                .catch(error => this.handleError(error, link, this.OLX));
        } else if (link.provider === this.IMOVIRTUAL) {
            return await this.imovirtualScrapeInteractor.call([link.url])
                .then(result => result.map(r => (new ApartmentMetadata({ ...r, provider: this.IMOVIRTUAL }))))
                .catch(error => this.handleError(error, link, this.IMOVIRTUAL));
        } else {
            return [];
        }
    }

    private handleError(provider: string, link, error): ApartmentMetadata[] {
        // tslint:disable-next-line: no-console
        console.error(`An error occurred when scrapping '${provider}'. `, link, error);
        return [];
    }

    private async mergeApartments(metaApartments: ApartmentMetadata[], userId: string): Promise<void> {
        const storedApartments = (await this.getApartmentsInteractor.call(userId))[0];
        for (const apartment of metaApartments) {
            const existApartment = storedApartments.find(q => q.ads[0].adsId === apartment.adsId);
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
