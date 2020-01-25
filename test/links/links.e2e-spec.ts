import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { getToken } from '../auth0_authentication';
import { Link } from '../../src/links/link.entity';
import { Repository } from 'typeorm';
import { createLink, parseLinks } from './links.utils';
import { ObjectID } from 'mongodb';

describe('LinksController (e2e)', () => {
    let app;
    let token;
    let linksRepository: Repository<Link>;
    let links = [];

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        token = await getToken();
        app = moduleFixture.createNestApplication();

        linksRepository = moduleFixture.get('LinkRepository');
        await app.init();
    });

    afterEach(async () => {
        const all = await linksRepository.find();
        all.forEach(async item => {
            await linksRepository.delete({ _id: item.id });
        });
        links = [];
    });

    describe('/links (GET)', () => {
        describe('when the request is without a token', () => {
            test('returns unauthorized', () => {
                return request(app.getHttpServer())
                    .get('/links')
                    .expect(401)
                    .expect({ statusCode: 401, error: 'Unauthorized' });
            });
        });

        describe('when get the links with a valid token', () => {
            beforeEach(async () => {
                const linksToCreate = [
                    createLink('http://dummy1.com', 'dummy1'),
                    createLink('http://dummy2.com', 'dummy2'),
                    createLink('http://dummy3.com', 'dummy3'),
                    createLink('http://dummy4.com', 'dummy4'),
                    createLink('http://dummy5.com', 'dummy5', 'otheruser'),
                ];
                for (const link of linksToCreate) {
                    const newLink = await linksRepository.save(link);
                    links.push(newLink);
                }
            });
            test('returns the links created by the user', async () => {
                return request(app.getHttpServer())
                    .get('/links')
                    .set('Authorization', `${token.token_type} ${token.access_token}`)
                    .expect(200)
                    .expect(parseLinks(links.filter(q => q.userId !== 'otheruser')))
                    .then(result => {
                        expect(result.body.length).toEqual(4);
                        return result;
                    });
            });
        });
    });

    describe('/links (POST)', () => {
        describe('when the request is without a token', () => {
            test('returns unauthorized', () => {
                return request(app.getHttpServer())
                    .post('/links')
                    .expect(401)
                    .expect({ statusCode: 401, error: 'Unauthorized' });
            });
        });

        describe('when is a non supported url', () => {
            test('returns bad request', async () => {
                return request(app.getHttpServer())
                    .post('/links')
                    .set('Authorization', `${token.token_type} ${token.access_token}`)
                    .send({
                        url: 'http://test.pt',
                    })
                    .expect(400)
                    .expect({
                        statusCode: 400,
                        error: 'Bad Request',
                        message: 'Provided url is not supported',
                    });
            });
        });

        describe('when is a supported url', () => {
            test('returns the correct structure', async () => {
                return request(app.getHttpServer())
                    .post('/links')
                    .set('Authorization', `${token.token_type} ${token.access_token}`)
                    .send({
                        url: 'http://remax.pt/asd',
                    })
                    .expect(201)
                    .then((result) => {
                        expect(result.body.provider).toEqual('REMAX');
                        expect(result.body.url).toEqual('http://remax.pt/asd');
                    });
            });
        });
    });

    describe('/links (DELETE)', () => {
        describe('when the request is without a token', () => {
            test('/links (DELETE)', () => {
                return request(app.getHttpServer())
                    .delete('/links/1')
                    .expect(401)
                    .expect({ statusCode: 401, error: 'Unauthorized' });
            });
        });

        describe('when the request has a token valid', () => {
            beforeEach(async () => {
                const linksToCreate = [
                    createLink('http://dummy1.com', 'dummy1'),
                    createLink('http://dummy2.com', 'dummy2'),
                ];
                for (const link of linksToCreate) {
                    const newLink = await linksRepository.save(link);
                    links.push(newLink);
                }
            });
            describe('when the id exists', () => {
                test('returns 200', () => {
                    return request(app.getHttpServer())
                        .delete(`/links/${links[0].id}`)
                        .set('Authorization', `${token.token_type} ${token.access_token}`)
                        .expect(200)
                        .expect({});
                });
            });

            describe('when the id does not exist', () => {
                test('returns 200', () => {
                    return request(app.getHttpServer())
                        .delete(`/links/${new ObjectID()}`)
                        .set('Authorization', `${token.token_type} ${token.access_token}`)
                        .expect(404);
                });
            });

        });
    });

    describe('/links (PUT)', () => {
        describe('when requests a put links', () => {
            beforeEach(async () => {
                const linksToCreate = [
                    createLink('http://dummy1.com', 'dummy1'),
                    createLink('http://dummy2.com', 'dummy2'),
                ];
                for (const link of linksToCreate) {
                    const newLink = await linksRepository.save(link);
                    links.push(newLink);
                }
            });
            test('returns not found', () => {
                return request(app.getHttpServer())
                    .put(`/links/${links[0].id}`)
                    .set('Authorization', `${token.token_type} ${token.access_token}`)
                    .expect(404)
                    .expect({ statusCode: 404, error: 'Not Found', message: `Cannot PUT /links/${links[0].id}` });
            });
        });
    });

    afterAll(done => {
        app.close();
        done();
    });
});
