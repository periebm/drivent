import {AllHotels } from '@/protocols';
import hotelsRepository from '../../repositories/hotels-repository';
import { paymentRequiredError } from '../../errors/payment-required-error';
import { notFoundError } from '../../errors';


async function verifyTicketEnrollmentPayment(userId: number) {

  const enrollment = await hotelsRepository.findUserEnrollmentById(userId);
  if (!enrollment) throw notFoundError(); 
  const ticket = await hotelsRepository.findUserTicketById(enrollment.userId);
  if(!ticket) throw notFoundError();
  if(ticket.TicketType.isRemote === true || ticket.status !== 'PAID' || ticket.TicketType.includesHotel === false) throw paymentRequiredError();
}


async function getAllHotels(userId: number) : Promise<AllHotels[]> {
  await verifyTicketEnrollmentPayment(userId);

  const result: AllHotels[] = await hotelsRepository.findAllHotels();

  if (!result) throw notFoundError();

  return result;
}

async function getHotelById(userId: number)/* : Promise<GetOneWithAddressByUserIdResult>  */{
/*   const enrollmentWithAddress = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollmentWithAddress) throw notFoundError();

  const [firstAddress] = enrollmentWithAddress.Address;
  const address = getFirstAddress(firstAddress); */

  return {

  };
}


const hotelsService = {
  getAllHotels,
  getHotelById
};

export default hotelsService;