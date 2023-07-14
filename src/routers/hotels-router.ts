import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getAllHotels, getHotelsById } from '../controllers/hotels-controller';

const hotelsRouter = Router();

hotelsRouter
    .all('/*', authenticateToken)
    .get('/',getAllHotels)
    .get('/:hotelId', getHotelsById)

export { hotelsRouter };
