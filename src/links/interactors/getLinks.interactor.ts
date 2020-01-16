import { Injectable } from '@nestjs/common';
import { Link } from '../link.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GetLinksInteractor {
    constructor(
        @InjectRepository(Link)
        private readonly linkRepository: Repository<Link>,
    ) { }

    public async call(userId: string): Promise<Link[]> {
        return await this.linkRepository.find({ userId });
    }
}
