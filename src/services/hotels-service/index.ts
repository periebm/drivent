import { Address, Enrollment } from '@prisma/client';
import { request } from '@/utils/request';
import { notFoundError } from '@/errors';
import addressRepository, { CreateAddressParams } from '@/repositories/address-repository';
import enrollmentRepository, { CreateEnrollmentParams } from '@/repositories/enrollment-repository';
import { exclude } from '@/utils/prisma-utils';
import {AllHotels } from '@/protocols';
import hotelsRepository from '../../repositories/hotels-repository';

async function getAllHotels() : Promise<AllHotels[]> {
  const result: AllHotels[] = await hotelsRepository.findAllHotels();

  if (!result) {
    throw notFoundError();
  }

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