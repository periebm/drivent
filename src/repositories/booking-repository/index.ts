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

const bookingRepository = {
  findBookings
}

export default bookingRepository;
