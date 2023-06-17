import { Router } from 'express';
import matchController from '../controllers/matchController';
import loginMiddlewares from '../middlewares/loginMiddlewares';
import matchMiddlewares from '../middlewares/matchMiddlewares';

const {
  validateToken,
} = loginMiddlewares;

const {
  verifyRequestDataToPatchMatch,
  verifyRequestDataToCreateMatch,
  verifyTeams,
} = matchMiddlewares;

const matchRouter = Router();

matchRouter.post(
  '/',
  validateToken,
  verifyRequestDataToCreateMatch,
  verifyTeams,
  matchController.createMatch,
);

matchRouter.get('/', matchController.getMatches);

matchRouter.patch('/:id/finish', validateToken, matchController.endMatch);

matchRouter.patch(
  '/:id',
  validateToken,
  verifyRequestDataToPatchMatch,
  matchController.updateMatch,
);

export default matchRouter;
