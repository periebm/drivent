import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getAllHotels, getHotelsRoom } from '../controllers/hotels-controller';

const hotelsRouter = Router();

hotelsRouter
    .all('/*', authenticateToken)
    .get('/',getAllHotels)
    .get('/:hotelId', getHotelsRoom)

export { hotelsRouter };
