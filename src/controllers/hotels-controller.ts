import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '../services/hotels-service';
//import enrollmentsService from '@/services/enrollments-service';

export async function getAllHotels(req: AuthenticatedRequest, res: Response) {
  try {
    const allHotels = await hotelsService.getAllHotels();

    return res.status(httpStatus.OK).send(allHotels);
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function getHotelsById(req: AuthenticatedRequest, res: Response) {
  let { userId } = req;

  try {
    const address = await hotelsService.getHotelById(userId);
    res.status(httpStatus.OK).send(address);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NO_CONTENT);
    }
  }
}
