import { Hotel, Enrollment, Ticket} from '@prisma/client';
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


const hotelsRepository = {
  findAllHotels,
  findUserEnrollmentById,
  findUserTicketById,
};

export default hotelsRepository;
