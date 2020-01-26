import 'dotenv/config';
import { Link } from '../../src/links/link.entity';

export function parseLinks(elements: Link[]): any[] {
    return elements.map(link => (JSON.parse(JSON.stringify({
        createdAt: link.createdAt,
        id: link.id,
        provider: link.provider,
        updatedAt: link.updatedAt,
        url: link.url,
        userId: link.userId,
    }))));
}

export function createLink(url: string, provider: string, userId: string = `${process.env.TEST_AUTH_CLIENT_ID}@clients`): Link {
    const l = new Link();
    l.url = url;
    l.provider = provider;
    l.userId = userId;
    return l;
}
