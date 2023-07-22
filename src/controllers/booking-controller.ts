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

export async function bookRoom(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const {roomId} = req.body
    try {
        const booking = await bookingService.postBooking(userId, Number(roomId))
        return res.status(httpStatus.OK).send(booking);
    } catch (error) {
        if (error.name === 'NotFoundError') {
            return res.sendStatus(httpStatus.NOT_FOUND);
        }
        return res.sendStatus(httpStatus.FORBIDDEN);
    }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const {roomId} = req.body;
    const {bookingId} = req.params;
    try {
        const booking = await bookingService.updateBooking(userId, Number(bookingId), Number(roomId))
        return res.status(httpStatus.OK).send(booking);
    } catch (error) {
        if (error.name === 'NotFoundError') {
            return res.sendStatus(httpStatus.NOT_FOUND);
        }
        return res.sendStatus(httpStatus.FORBIDDEN);
    }
}