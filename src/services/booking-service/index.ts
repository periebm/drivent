import { forbiddenError, notFoundError } from "../../errors";
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

async function postBooking(userId: number, roomId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) throw notFoundError();

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
        throw forbiddenError(); 
      }
    
    const bookings = await bookingRepository.checkRoomVacancy(roomId)
    const room = await bookingRepository.getRoom(roomId)
    
    if (!room) throw notFoundError();

    if(bookings >= room.capacity) throw forbiddenError();
    
    const newBooking = await bookingRepository.createBooking(userId, roomId)
    return {bookingId: newBooking.id}
}  

async function updateBooking(userId: number, bookingId:number,newRoomId: number) {
    const userBooking = await bookingRepository.findBookingById(bookingId);
    if (!userBooking) throw forbiddenError();

    const bookings = await bookingRepository.checkRoomVacancy(newRoomId)
    const room = await bookingRepository.getRoom(newRoomId)
    
    if (!room) throw notFoundError();
    
    if(bookings >= room.capacity) throw forbiddenError();
    
    const newBooking = await bookingRepository.updateBooking(bookingId, newRoomId)
    return {bookingId: newBooking.id}
} 

export default {
    findBooking,
    postBooking,
    updateBooking
}