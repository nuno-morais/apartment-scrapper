import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectID } from 'mongodb';
import { MongoRepository } from 'typeorm';
import { Apartment } from '../apartment.entity';

@Injectable()
export class GetApartmentInteractor {
    constructor(
        @InjectRepository(Apartment)
        private readonly apartmentRepository: MongoRepository<Apartment>,
    ) { }

    public async call(id: string, userId: string): Promise<Apartment> {
        const apartment = await this.apartmentRepository.findOne({ _id: new ObjectID(id), userId });
        if (!apartment) {
            throw new NotFoundException('Entity not found');
        }
        return apartment;
    }
}
