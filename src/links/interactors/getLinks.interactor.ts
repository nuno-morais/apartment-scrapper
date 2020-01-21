import { Injectable } from '@nestjs/common';
import { Link } from '../link.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryOptions } from './../../common/Queries/query-options';

@Injectable()
export class GetLinksInteractor {
    constructor(
        @InjectRepository(Link)
        private readonly linkRepository: Repository<Link>,
    ) { }

    public async call(userId: string, query: QueryOptions = new QueryOptions()): Promise<[Link[], number]> {
        const conditions = {
            where: { userId }, ...query.toMongoQuery(),
        };
        return await this.linkRepository.findAndCount(conditions);
    }
}
