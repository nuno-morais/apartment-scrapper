import { Injectable } from '@nestjs/common';
import { Apartment } from '../apartment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';

@Injectable()
export class CreateApartmentInteractor {
    constructor(
        @InjectRepository(Apartment)
        private readonly apartmentRepository: MongoRepository<Apartment>,
    ) { }

    public async call(apartment: Apartment, userId: string): Promise<Apartment> {
        apartment.isHidden = !!apartment.isHidden;
        apartment.isFavorite = !!apartment.isFavorite;
        return await this.apartmentRepository.save({ ...apartment, userId });
    }
}
