import { Injectable, NotFoundException } from '@nestjs/common';
import { Apartment } from '../apartment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectID } from 'mongodb';

@Injectable()
export class GetApartmentInteractor {
    constructor(
        @InjectRepository(Apartment)
        private readonly apartmentRepository: Repository<Apartment>,
    ) { }

    public async call(id: string, userId: string): Promise<Apartment> {
        const apartment = await this.apartmentRepository.findOne({ _id: new ObjectID(id), userId });
        if (!apartment) {
            throw new NotFoundException('Entity not found');
        }
        return apartment;
    }
}
