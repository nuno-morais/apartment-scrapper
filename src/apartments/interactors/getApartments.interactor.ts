import { Injectable, NotFoundException } from '@nestjs/common';
import { Apartment } from '../apartment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GetApartmentsInteractor {
    constructor(
        @InjectRepository(Apartment)
        private readonly apartmentRepository: Repository<Apartment>,
    ) { }

    public async call(userId: string): Promise<Apartment[]> {
        return await this.apartmentRepository.find({ userId });
    }
}
