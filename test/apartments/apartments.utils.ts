import 'dotenv/config';
import { ApartmentMetadata } from '../../src/apartments/apartment-metada.entity';
import { Apartment } from '../../src/apartments/apartment.entity';

export function parseApartment(element: Apartment): any {
    return JSON.parse(JSON.stringify(element));
}
export function parseApartments(elements: Apartment[]): any[] {
    return JSON.parse(JSON.stringify(elements));
}

export function createApartment(
    title: string, price: string, image: string, isFavorite = false, isHidden = false,
    userId: string = `${process.env.TEST_AUTH_CLIENT_ID}@clients`): Apartment {
    const apartment = new Apartment();
    const ads = new ApartmentMetadata();
    ads.title = title;
    ads.price = price;
    ads.url = 'http://test.com';
    apartment.ads = [ads];
    apartment.image = image;
    apartment.isFavorite = isFavorite;
    apartment.isHidden = isHidden;
    apartment.price = price;
    apartment.title = title;
    apartment.userId = userId;
    return apartment;
}
