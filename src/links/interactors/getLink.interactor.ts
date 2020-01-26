import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectID } from 'mongodb';
import { MongoRepository } from 'typeorm';
import { Link } from '../link.entity';

@Injectable()
export class GetLinkInteractor {
    constructor(
        @InjectRepository(Link)
        private readonly linkRepository: MongoRepository<Link>,
    ) { }
    public async call(id: string, userId: string): Promise<Link> {
        const link = await this.linkRepository.findOne({ _id: new ObjectID(id), userId });
        if (!link) {
            throw new NotFoundException('Entity not found');
        }
        return link;
    }
}
