import httpStatus from "http-status";
import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares";
import bookingService from "../services/booking-service";

export async function getBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;

    try {
        const booking = await bookingService.findBooking(userId)
        return res.status(httpStatus.OK).send(booking);
    } catch (error) {
        if (error.name === 'NotFoundError') {
            return res.sendStatus(httpStatus.NOT_FOUND);
        }
    }
}