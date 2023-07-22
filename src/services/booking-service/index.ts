import { notFoundError } from "../../errors";
import { cannotListHotelsError } from "../../errors/cannot-list-hotels-error";
import bookingRepository from "../../repositories/booking-repository";
import enrollmentRepository from "../../repositories/enrollment-repository";
import ticketsRepository from "../../repositories/tickets-repository";


async function findBooking(userId: number) {
    const booking = await bookingRepository.findBookings(userId);
    if (!booking) {
        throw notFoundError();
    }
    return {
        id: booking.id,
        Room: booking.Room
    };
}


export default {
    findBooking
}