import { Hotel } from '@prisma/client';
import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createHotel(){
  return prisma.hotel.create({
    data:{
      name: faker.name.jobArea(),
      image: faker.image.imageUrl(), 
    }
  })
}

export async function createRoom(hotelId: number){
  return prisma.room.create({
    data:{
      name: faker.name.jobDescriptor(),
      capacity: faker.datatype.number({ min: 1, max: 6 }),
      hotelId
    }
  })
}

