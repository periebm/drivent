import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import supertest from 'supertest';
import * as jwt from 'jsonwebtoken';
import { TicketStatus } from '.prisma/client';
import { cleanDb, generateValidToken } from '../helpers';
import {
    createEnrollmentWithAddress,
    createHotel,
    createPayment,
    createRoomWithHotelId,
    createTicket,
    createTicketTypeRemote,
    createTicketTypeWithHotel,
    createUser,
} from '../factories';
import app, { init } from '@/app';
import { createBooking } from '../factories/booking-factory';
import { any } from 'joi';

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app);

describe('GET /booking', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/booking');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {

        it('should respond with status 404 when user has no booking ', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);

            const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it('should respond with status 200 and a list of hotels', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);

            const createdHotel = await createHotel();
            const createdRoom = await createRoomWithHotelId(createdHotel.id);
            const booking = await createBooking(user.id, createdRoom.id);

            const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(httpStatus.OK);

            expect({
                id: response.body.id,
                Room: response.body.Room
            }).toEqual(
                {
                    id: booking.id, Room: { ...createdRoom, updatedAt: response.body.Room.updatedAt, createdAt: response.body.Room.createdAt }
                },
            );
        });
    });
});

describe('POST /booking', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.post('/booking');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    -
        describe('when token is valid', () => {

            it('should respond with status 404 when roomId doesn`t exist ', async () => {
                const user = await createUser();
                const token = await generateValidToken(user);

                const body = { roomId: 1 }
                const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

                expect(response.status).toEqual(httpStatus.NOT_FOUND);
            });

            it('should respond with status 403 when roomId is not vacant ', async () => {
                const user = await createUser();
                const token = await generateValidToken(user);

                const createdHotel = await createHotel();
                const createdRoom = await createRoomWithHotelId(createdHotel.id);
                const enrollment = await createEnrollmentWithAddress(user);
                const ticketType = await createTicketTypeWithHotel();
                const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
                await createPayment(ticket.id, ticketType.price);

                const user1 = await createUser();
                const user2 = await createUser();
                const user3 = await createUser();

                await createBooking(user1.id, createdRoom.id);
                await createBooking(user2.id, createdRoom.id);
                await createBooking(user3.id, createdRoom.id);

                const body = { roomId: createdRoom.id }
                const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

                expect(response.status).toEqual(httpStatus.FORBIDDEN);
            });


            it('should respond with status 200 and bookingId', async () => {
                const user = await createUser();
                const token = await generateValidToken(user);
                const createdHotel = await createHotel();
                const createdRoom = await createRoomWithHotelId(createdHotel.id);
                const enrollment = await createEnrollmentWithAddress(user);
                const ticketType = await createTicketTypeWithHotel();
                const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
                await createPayment(ticket.id, ticketType.price);
                const body = { roomId: createdRoom.id }


                const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);
                expect(response.status).toEqual(httpStatus.OK);

                expect(response.body).toEqual(
                    {
                        bookingId: expect.any(Number)
                    }
                );
            });

        });
});

describe('PUT /booking/:bookingId', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.put('/booking/1');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.post('/booking/1').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.post('/booking/1').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    -
        describe('when token is valid', () => {

            it('should respond with status 404 when roomId doesn`t exist ', async () => {
                const user = await createUser();
                const token = await generateValidToken(user);

                const createdHotel = await createHotel();
                const createdRoom = await createRoomWithHotelId(createdHotel.id);
                const booking = await createBooking(user.id, createdRoom.id);

                const body = { roomId: -1 }

                const response = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).send(body);
                expect(response.status).toEqual(httpStatus.NOT_FOUND);
            });

            it('should respond with status 403 when roomId is not vacant ', async () => {
                const user = await createUser();
                const token = await generateValidToken(user);

                const createdHotel = await createHotel();
                const createdRoom1 = await createRoomWithHotelId(createdHotel.id);
                const createdRoom2 = await createRoomWithHotelId(createdHotel.id);

                const enrollment = await createEnrollmentWithAddress(user);
                const ticketType = await createTicketTypeWithHotel();
                const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
                await createPayment(ticket.id, ticketType.price);

                const user1 = await createUser();
                const user2 = await createUser();
                const user3 = await createUser();

                const booking = await createBooking(user.id, createdRoom1.id);
                await createBooking(user1.id, createdRoom2.id);
                await createBooking(user2.id, createdRoom2.id);
                await createBooking(user3.id, createdRoom2.id);

                const body = { roomId: createdRoom2.id }
                const response = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).send(body);

                expect(response.status).toEqual(httpStatus.FORBIDDEN);
            });


            it('should respond with status 200 and bookingId', async () => {
                const user = await createUser();
                const token = await generateValidToken(user);
                const createdHotel = await createHotel();
                const createdRoom1 = await createRoomWithHotelId(createdHotel.id);
                const createdRoom2 = await createRoomWithHotelId(createdHotel.id);

                const enrollment = await createEnrollmentWithAddress(user);
                const ticketType = await createTicketTypeWithHotel();
                const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
                await createPayment(ticket.id, ticketType.price);

                const booking = await createBooking(user.id, createdRoom1.id);

                const body = { roomId: createdRoom2.id }

                const response = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).send(body);
                expect(response.status).toEqual(httpStatus.OK);

                expect(response.body).toEqual(
                    {
                        bookingId: expect.any(Number)
                    }
                );
            });

        });
});
