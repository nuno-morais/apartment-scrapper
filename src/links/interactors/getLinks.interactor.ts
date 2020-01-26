import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { QueryOptions } from '../../common/queries/query-options';
import { Link } from '../link.entity';

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
