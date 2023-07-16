import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '../services/hotels-service';

export async function getAllHotels(req: AuthenticatedRequest, res: Response) {
  try {
    const allHotels = await hotelsService.getAllHotels(req.userId);
    if (!allHotels) return res.sendStatus(httpStatus.NOT_FOUND);

    return res.status(httpStatus.OK).send(allHotels);
  } catch (error) {
    if (error.name === 'UnauthorizedError') {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    else if (error.name === 'PaymentRequiredError') {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function getHotelsRoom(req: AuthenticatedRequest, res: Response) {
  let hotelId = parseInt(req.params.hotelId)
  try {
    const allHotels = await hotelsService.getHotelById(hotelId, req.userId);
    if (!allHotels) return res.sendStatus(httpStatus.NOT_FOUND);

    return res.status(httpStatus.OK).send(allHotels);
  } catch (error) {
    if (error.name === 'UnauthorizedError') {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    else if (error.name === 'PaymentRequiredError') {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
