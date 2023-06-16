import { Router } from 'express';
import matchController from '../controllers/matchController';
import loginMiddlewares from '../middlewares/loginMiddlewares';

const {
  validateToken,
} = loginMiddlewares;

const matchRouter = Router();

matchRouter.get('/', matchController.getMatches);

matchRouter.patch('/:id/finish', validateToken, matchController.endMatch);

export default matchRouter;
