import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectID } from 'mongodb';
import { MongoRepository } from 'typeorm';
import { Link } from '../link.entity';

@Injectable()
export class DeleteLinkInteractor {
    constructor(
        @InjectRepository(Link)
        private readonly linkRepository: MongoRepository<Link>,
    ) { }

    public async call(id: string, userId: string): Promise<void> {
        const link = await this.linkRepository.findOne({ _id: new ObjectID(id), userId });
        if (!link) {
            throw new NotFoundException('Entity not found');
        }
        await this.linkRepository.remove(link);
    }
}
