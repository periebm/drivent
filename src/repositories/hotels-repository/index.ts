import { Hotel, Enrollment, Ticket, Room} from '@prisma/client';
import { prisma } from '@/config';

async function findAllHotels() {
  return prisma.hotel.findMany();
}


async function findUserEnrollmentById(userId: number){
    return prisma.enrollment.findFirst({
      where: { userId }
    });
}

async function findUserTicketById(enrollmentId: number){
  return prisma.ticket.findFirst({
    where: { enrollmentId },
    include: {
      TicketType: true
    },
  });
}

async function findHotelRooms(id: number) {
  return prisma.hotel.findFirst({
    where: {id},
    include: {
      Rooms: true
    } 
  });
}

const hotelsRepository = {
  findAllHotels,
  findUserEnrollmentById,
  findUserTicketById,
  findHotelRooms
};

export default hotelsRepository;
