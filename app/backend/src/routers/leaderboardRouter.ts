import { Router } from 'express';
import leaderboardController from '../controllers/leaderboardController';

const leaderboardRouter = Router();

leaderboardRouter.get('/home', leaderboardController.getleaderboard);

leaderboardRouter.get('/away', leaderboardController.getleaderboard);

export default leaderboardRouter;
