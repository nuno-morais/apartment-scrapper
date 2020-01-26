import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { QueryOptions } from '../../common/queries/query-options';
import { Apartment } from '../apartment.entity';

@Injectable()
export class GetApartmentsInteractor {
    constructor(
        @InjectRepository(Apartment)
        private readonly apartmentRepository: MongoRepository<Apartment>,
    ) { }

    public async call(userId: string, isHiddenEnabled: boolean = true, query: QueryOptions = new QueryOptions()): Promise<[Apartment[], number]> {
        let isHiddenQuery = {};
        if (!isHiddenEnabled) {
            isHiddenQuery = { isHidden: { $not: { $eq: true } } };
        }
        const conditions = {
            where: { userId, ...isHiddenQuery }, ...QueryOptions.fromQueryOptions(query).toMongoQuery(),
        };
        return await this.apartmentRepository.findAndCount(conditions);
    }
}
