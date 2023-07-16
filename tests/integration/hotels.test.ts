import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import {
  createEnrollmentWithAddress,
  createUser,
  createTicketType,
  createTicket,
  createCustomTicketType,
  createHotel,
  createRoom,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import { prisma } from '@/config';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /hotels', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {

    it('should respond with status 404 when there is no enrollment for given user', async () => {
      const token = await generateValidToken();

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });


    it('should respond with status 404 ticket doesnt exist', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 404 when user doesnt own given ticket', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();

      const otherUser = await createUser();
      const otherUserEnrollment = await createEnrollmentWithAddress(otherUser);
      const ticket = await createTicket(otherUserEnrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await server.get(`/hotels`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 402 when user owns a ticket which was not paid', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const userEnrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();

      const ticket = await createTicket(userEnrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await server.get(`/hotels`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 402 when user owns a remote ticket type', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const userEnrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createCustomTicketType(true, true);

      const ticket = await createTicket(userEnrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get(`/hotels`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 402 when user owns ticket type doesn`t includes hotel', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const userEnrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createCustomTicketType(false, false);

      const ticket = await createTicket(userEnrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get(`/hotels`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 200', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const userEnrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createCustomTicketType(false, true);
      const ticket = await createTicket(userEnrollment.id, ticketType.id, TicketStatus.PAID);

      await createHotel();
      await createHotel();

      const response = await server.get(`/hotels`).set('Authorization', `Bearer ${token}`);
      expect(response.body).toHaveLength(2);
      expect(response.status).toEqual(httpStatus.OK);
    })
  });
});

describe('GET /hotels/:id', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels/1');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {

    it('should respond with status 404 when there is no enrollment for given user', async () => {
      const token = await generateValidToken();

      const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });


    it('should respond with status 404 ticket doesnt exist', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 404 when user doesnt own given ticket', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();

      const otherUser = await createUser();
      const otherUserEnrollment = await createEnrollmentWithAddress(otherUser);
      const ticket = await createTicket(otherUserEnrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await server.get(`/hotels/1`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 402 when user owns a ticket which was not paid', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const userEnrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();

      const ticket = await createTicket(userEnrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await server.get(`/hotels/1`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 402 when user owns a remote ticket type', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const userEnrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createCustomTicketType(true, true);

      const ticket = await createTicket(userEnrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get(`/hotels/1`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 402 when user owns ticket type doesn`t includes hotel', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const userEnrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createCustomTicketType(false, false);

      const ticket = await createTicket(userEnrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get(`/hotels/1`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 200', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const userEnrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createCustomTicketType(false, true);
      const ticket = await createTicket(userEnrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const otherRoom = await createRoom(hotel.id)


      const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.OK);
    })
  });
});
