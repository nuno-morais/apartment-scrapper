import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Link } from '../link.entity';
import { QueryOptions } from './../../common/Queries/query-options';

@Injectable()
export class GetLinksInteractor {
    constructor(
        @InjectRepository(Link)
        private readonly linkRepository: MongoRepository<Link>,
    ) { }

    public async call(userId: string, query: QueryOptions = new QueryOptions()): Promise<[Link[], number]> {
        const conditions = {
            where: { userId }, ...QueryOptions.fromQueryOptions(query).toMongoQuery(),
        };
        return await this.linkRepository.findAndCount(conditions);
    }
}
