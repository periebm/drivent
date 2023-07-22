import { Booking } from '@prisma/client';
import { prisma } from '@/config';

async function findBookings(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId
    },
    include: {
      Room: true
    },
  });
}

async function findBookingById(bookingId: number) {
  return prisma.booking.findFirst({
    where: {
      id: bookingId
    },
    include: {
      Room: true
    },
  });
}

async function checkRoomVacancy(roomId : number){
  return prisma.booking.count({
    where: {
      roomId: roomId}
  })
}

async function getRoom(roomId : number){
  return prisma.room.findFirst({
    where: {
      id: roomId}
  })
}

async function createBooking(userId:number,roomId : number){
  return prisma.booking.create({
    data: {
      userId,
      roomId
    }
  })
}

async function updateBooking(bookingId:number, newRoomId : number){
  return prisma.booking.update({
    where: {
      id: bookingId
    },
    data:{
      roomId: newRoomId
    }
  })
}



const bookingRepository = {
  findBookings,
  checkRoomVacancy,
  getRoom,
  createBooking,
  findBookingById,
  updateBooking
}

export default bookingRepository;
