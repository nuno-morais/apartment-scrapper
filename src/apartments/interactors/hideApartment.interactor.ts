import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectID } from 'mongodb';
import { MongoRepository } from 'typeorm';
import { Apartment } from '../apartment.entity';
import { GetApartmentInteractor } from './getApartment.interactor';

@Injectable()
export class HideApartmentInteractor {
    constructor(
        @InjectRepository(Apartment)
        private readonly apartmentRepository: MongoRepository<Apartment>,
        private readonly getApartmentInteractor: GetApartmentInteractor,
    ) { }

    public async call(id: string, userId: string, hide = true): Promise<Apartment> {
        const apartment = await this.getApartmentInteractor.call(id, userId);
        if (apartment == null) {
            throw new NotFoundException('Entity not found');
        }
        apartment.isHidden = hide;
        await this.apartmentRepository.findOneAndUpdate(
            { _id: new ObjectID(apartment.id) }, { $set: apartment }, { returnOriginal: false });
        return apartment;
    }
}
