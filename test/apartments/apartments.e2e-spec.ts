import { Test, TestingModule } from '@nestjs/testing';
import 'dotenv/config';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { Apartment } from '../../src/apartments/apartment.entity';
import { AppModule } from '../../src/app.module';
import { getToken } from '../auth0_authentication';
import { createApartment, parseApartment, parseApartments } from './apartments.utils';

describe('ApartmentsController (e2e)', () => {
    let app;
    let token;
    let apartmentsRepository: Repository<Apartment>;
    let apartments = [];
    const currentUser = `${process.env.TEST_AUTH_CLIENT_ID}@clients`;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        token = await getToken();
        app = moduleFixture.createNestApplication();

        apartmentsRepository = moduleFixture.get('ApartmentRepository');
        await app.init();
    });

    afterEach(async () => {
        const all = await apartmentsRepository.find();
        all.forEach(async item => {
            await apartmentsRepository.delete({ _id: item.id });
        });
        apartments = [];
    });

    describe('/apartments (GET)', () => {
        describe('when the request is without a token', () => {
            test('returns unauthorized', () => {
                return request(app.getHttpServer())
                    .get('/apartments')
                    .expect(401)
                    .expect({ statusCode: 401, error: 'Unauthorized' });
            });
        });
        describe('when get the apartments with a valid token', () => {
            beforeEach(async () => {
                const apartmentsToCreate = [
                    createApartment('title1', '100€', 'img1', false, false),
                    createApartment('title2', '110€', 'img2', true, false),
                    createApartment('title3', '120€', 'img3', false, true),
                    createApartment('title4', '130€', 'img4', false, false),
                    createApartment('title5', '140€', 'img5', false, false, 'otheruserid'),
                    createApartment('title6', '150€', 'img6', true, false, 'otheruserid'),
                    createApartment('title7', '160€', 'img7', false, true, 'otheruserid'),
                    createApartment('title8', '170€', 'img8', false, false, 'otheruserid'),
                ];
                for (const apartment of apartmentsToCreate) {
                    const newApartment = await apartmentsRepository.save(apartment);
                    apartments.push(newApartment);
                }
            });
            test('returns all non hidden apartments for the user', async () => {
                return request(app.getHttpServer())
                    .get('/apartments')
                    .set('Authorization', `${token.token_type} ${token.access_token}`)
                    .expect(200)
                    .expect(parseApartments(
                        apartments.filter(q => q.userId === currentUser && q.isHidden === false)))
                    .then(result => {
                        expect(result.body.length).toEqual(3);
                        return result;
                    });
            });

            describe('when a sort filter is applied', () => {
                test('returns all non hidden apartments sorted correctly', () => {
                    return request(app.getHttpServer())
                        .get('/apartments')
                        .query({ _sort: 'title', _order: 'DESC', _start: 1, _end: 3 })
                        .set('Authorization', `${token.token_type} ${token.access_token}`)
                        .expect(200)
                        .expect(parseApartments(
                            apartments.filter(q => q.userId === currentUser && q.isHidden === false)
                                .splice(0, 2)
                                .sort((a, b) => b.title.localeCompare(a.title)),
                        ))
                        .then(result => {
                            expect(result.body.length).toEqual(2);
                            return result;
                        });
                });
            });
        });
    });

    describe('/apartments/{id}/actions/hide (POST)', () => {
        beforeEach(async () => {
            const apartmentsToCreate = [
                createApartment('title1', '100€', 'img1', false, false),
                createApartment('title2', '110€', 'img2', true, false),
                createApartment('title3', '120€', 'img3', false, true),
                createApartment('title4', '130€', 'img4', false, false),
                createApartment('title5', '140€', 'img5', false, false, 'otheruserid'),
                createApartment('title6', '150€', 'img6', true, false, 'otheruserid'),
                createApartment('title7', '160€', 'img7', false, true, 'otheruserid'),
                createApartment('title8', '170€', 'img8', false, false, 'otheruserid'),
            ];
            for (const apartment of apartmentsToCreate) {
                const newApartment = await apartmentsRepository.save(apartment);
                apartments.push(newApartment);
            }
        });
        describe('when the request is without a token', () => {
            test('returns unauthorized', () => {
                return request(app.getHttpServer())
                    .post(`/apartments/${apartments[0].id}/actions/hide`)
                    .expect(401)
                    .expect({ statusCode: 401, error: 'Unauthorized' });
            });
        });

        describe('when hide an apartment with a valid token', () => {
            describe('when the apartment is associated to the user', () => {
                test('updates the apartment with isHidden = true', async () => {
                    return request(app.getHttpServer())
                        .post(`/apartments/${apartments[0].id}/actions/hide`)
                        .set('Authorization', `${token.token_type} ${token.access_token}`)
                        .expect(200)
                        .expect(parseApartment(
                            { ...apartments[0], isHidden: true },
                        ));
                });
            });

            describe('when the apartment is not associated to the user', () => {
                test('returns not found', async () => {
                    return request(app.getHttpServer())
                        .post(`/apartments/${apartments[7].id}/actions/hide`)
                        .set('Authorization', `${token.token_type} ${token.access_token}`)
                        .expect(404)
                        .expect({ error: 'Not Found', message: 'Entity not found', statusCode: 404 });
                });
            });
        });
    });

    describe('/apartments/{id}/actions/show (POST)', () => {
        beforeEach(async () => {
            const apartmentsToCreate = [
                createApartment('title1', '100€', 'img1', false, false),
                createApartment('title2', '110€', 'img2', true, false),
                createApartment('title3', '120€', 'img3', false, true),
                createApartment('title4', '130€', 'img4', false, false),
                createApartment('title5', '140€', 'img5', false, false, 'otheruserid'),
                createApartment('title6', '150€', 'img6', true, false, 'otheruserid'),
                createApartment('title7', '160€', 'img7', false, true, 'otheruserid'),
                createApartment('title8', '170€', 'img8', false, false, 'otheruserid'),
            ];
            for (const apartment of apartmentsToCreate) {
                const newApartment = await apartmentsRepository.save(apartment);
                apartments.push(newApartment);
            }
        });
        describe('when the request is without a token', () => {
            test('returns unauthorized', () => {
                return request(app.getHttpServer())
                    .post(`/apartments/${apartments[2].id}/actions/show`)
                    .expect(401)
                    .expect({ statusCode: 401, error: 'Unauthorized' });
            });
        });

        describe('when show an apartment with a valid token', () => {
            describe('when the apartment is associated to the user', () => {
                test('updates the apartment with isHidden = false', async () => {
                    return request(app.getHttpServer())
                        .post(`/apartments/${apartments[2].id}/actions/show`)
                        .set('Authorization', `${token.token_type} ${token.access_token}`)
                        .expect(200)
                        .expect(parseApartment(
                            { ...apartments[2], isHidden: false },
                        ));
                });
            });

            describe('when the apartment is not associated to the user', () => {
                test('returns not found', async () => {
                    return request(app.getHttpServer())
                        .post(`/apartments/${apartments[6].id}/actions/show`)
                        .set('Authorization', `${token.token_type} ${token.access_token}`)
                        .expect(404)
                        .expect({ error: 'Not Found', message: 'Entity not found', statusCode: 404 });
                });
            });
        });
    });

    describe('/apartments/{id}/actions/favorite (POST)', () => {
        beforeEach(async () => {
            const apartmentsToCreate = [
                createApartment('title1', '100€', 'img1', false, false),
                createApartment('title2', '110€', 'img2', true, false),
                createApartment('title3', '120€', 'img3', false, true),
                createApartment('title4', '130€', 'img4', false, false),
                createApartment('title5', '140€', 'img5', false, false, 'otheruserid'),
                createApartment('title6', '150€', 'img6', true, false, 'otheruserid'),
                createApartment('title7', '160€', 'img7', false, true, 'otheruserid'),
                createApartment('title8', '170€', 'img8', false, false, 'otheruserid'),
            ];
            for (const apartment of apartmentsToCreate) {
                const newApartment = await apartmentsRepository.save(apartment);
                apartments.push(newApartment);
            }
        });
        describe('when the request is without a token', () => {
            test('returns unauthorized', () => {
                return request(app.getHttpServer())
                    .post(`/apartments/${apartments[0].id}/actions/favorite`)
                    .expect(401)
                    .expect({ statusCode: 401, error: 'Unauthorized' });
            });
        });

        describe('when wants to put an apartment as favorite with a valid token', () => {
            describe('when the apartment is associated to the user', () => {
                test('updates the apartment with isFavorite = true', async () => {
                    return request(app.getHttpServer())
                        .post(`/apartments/${apartments[0].id}/actions/favorite`)
                        .set('Authorization', `${token.token_type} ${token.access_token}`)
                        .expect(200)
                        .expect(parseApartment(
                            { ...apartments[0], isFavorite: true },
                        ));
                });
            });

            describe('when the apartment is not associated to the user', () => {
                test('returns not found', async () => {
                    return request(app.getHttpServer())
                        .post(`/apartments/${apartments[7].id}/actions/favorite`)
                        .set('Authorization', `${token.token_type} ${token.access_token}`)
                        .expect(404)
                        .expect({ error: 'Not Found', message: 'Entity not found', statusCode: 404 });
                });
            });
        });
    });

    describe('/apartments/{id}/actions/nonfavorite (POST)', () => {
        beforeEach(async () => {
            const apartmentsToCreate = [
                createApartment('title1', '100€', 'img1', false, false),
                createApartment('title2', '110€', 'img2', true, false),
                createApartment('title3', '120€', 'img3', false, true),
                createApartment('title4', '130€', 'img4', false, false),
                createApartment('title5', '140€', 'img5', false, false, 'otheruserid'),
                createApartment('title6', '150€', 'img6', true, false, 'otheruserid'),
                createApartment('title7', '160€', 'img7', false, true, 'otheruserid'),
                createApartment('title8', '170€', 'img8', false, false, 'otheruserid'),
            ];
            for (const apartment of apartmentsToCreate) {
                const newApartment = await apartmentsRepository.save(apartment);
                apartments.push(newApartment);
            }
        });
        describe('when the request is without a token', () => {
            test('returns unauthorized', () => {
                return request(app.getHttpServer())
                    .post(`/apartments/${apartments[1].id}/actions/nonfavorite`)
                    .expect(401)
                    .expect({ statusCode: 401, error: 'Unauthorized' });
            });
        });

        describe('when wants to put an apartment as non favorite with a valid token', () => {
            describe('when the apartment is associated to the user', () => {
                test('updates the apartment with isDavorite = false', async () => {
                    return request(app.getHttpServer())
                        .post(`/apartments/${apartments[1].id}/actions/nonfavorite`)
                        .set('Authorization', `${token.token_type} ${token.access_token}`)
                        .expect(200)
                        .expect(parseApartment(
                            { ...apartments[1], isFavorite: false },
                        ));
                });
            });

            describe('when the apartment is not associated to the user', () => {
                test('returns not found', async () => {
                    return request(app.getHttpServer())
                        .post(`/apartments/${apartments[5].id}/actions/nonfavorite`)
                        .set('Authorization', `${token.token_type} ${token.access_token}`)
                        .expect(404)
                        .expect({ error: 'Not Found', message: 'Entity not found', statusCode: 404 });
                });
            });
        });
    });
});
