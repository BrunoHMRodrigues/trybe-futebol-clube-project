import { Router } from 'express';
import matchController from '../controllers/matchController';

const matchRouter = Router();

matchRouter.get('/', matchController.getMatches);

export default matchRouter;
