import {AllHotels, HotelRooms } from '@/protocols';
import hotelsRepository from '../../repositories/hotels-repository';
import { paymentRequiredError } from '../../errors/payment-required-error';
import { notFoundError } from '../../errors';


async function verifyTicketEnrollmentPayment(userId: number) {

  const enrollment = await hotelsRepository.findUserEnrollmentById(userId);
  if (!enrollment) throw notFoundError(); 
  const ticket = await hotelsRepository.findUserTicketById(enrollment.id);
  if(!ticket) throw notFoundError();
  if(ticket.TicketType.isRemote === true || ticket.status !== 'PAID' || ticket.TicketType.includesHotel === false) throw paymentRequiredError();
}


async function getAllHotels(userId: number) : Promise<AllHotels[]> {
  await verifyTicketEnrollmentPayment(userId);

  const result: AllHotels[] = await hotelsRepository.findAllHotels();
  if (result.length === 0) throw notFoundError();

  return result;
}

async function getHotelById(id: number, userId: number) : Promise<HotelRooms>   {
  await verifyTicketEnrollmentPayment(userId);
  const result: HotelRooms = await hotelsRepository.findHotelRooms(id);

  return result;
}


const hotelsService = {
  getAllHotels,
  getHotelById
};

export default hotelsService;