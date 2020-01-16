import { Injectable, BadRequestException } from '@nestjs/common';
import { Link } from '../link.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as parseDomain from 'parse-domain';

@Injectable()
export class CreateLinkInteractor {
    private allowedProviders = ['REMAX.PT', 'OLX.PT', 'IMOVIRTUAL.COM'];
    constructor(
        @InjectRepository(Link)
        private readonly linkRepository: Repository<Link>,
    ) { }

    public async call(link: Link, userId: string): Promise<Link> {
        const domain = this.getDomain(link.url);
        return await this.linkRepository.save({ ...link, provider: domain, userId });
    }

    private getDomain(url: string) {
        const parsedDomain = parseDomain(url);
        const domain = `${parsedDomain.domain.toLocaleUpperCase()}`;
        const domainTLD = `${domain}.${parsedDomain.tld.toLocaleUpperCase()}`;
        if (this.allowedProviders.indexOf(domainTLD) === -1) {
            throw new BadRequestException('Provided url is not supported');
        }
        return domain;
    }
}
