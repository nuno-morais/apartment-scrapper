import { Injectable } from '@nestjs/common';
import { Apartment } from '../apartment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { GetApartmentInteractor } from './getApartment.interactor';
import { ObjectID } from 'mongodb';

@Injectable()
export class FavoriteApartmentInteractor {
    constructor(
        @InjectRepository(Apartment)
        private readonly apartmentRepository: MongoRepository<Apartment>,
        private readonly getApartmentInteractor: GetApartmentInteractor,
    ) { }

    public async call(id: string, userId: string): Promise<Apartment> {
        const apartment = await this.getApartmentInteractor.call(id, userId);
        apartment.isFavorite = true;
        await this.apartmentRepository.findOneAndUpdate(
            { _id: new ObjectID(apartment.id) }, { $set: apartment }, { returnOriginal: false });
        return apartment;
    }
}
