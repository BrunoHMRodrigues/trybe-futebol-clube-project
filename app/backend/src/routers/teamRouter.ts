import { Router } from 'express';
import teamController from '../controllers/teamController';

const teamRouter = Router();

teamRouter.get('/', teamController.getAllTeams);

teamRouter.get('/:id', teamController.getTeamById);

export default teamRouter;
