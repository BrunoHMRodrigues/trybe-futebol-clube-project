import { Request, Response } from 'express';
import leaderboardService from '../services/leaderboardService';
import mapStatusHTTP from '../utils/mapStatusHTTP';

async function getleaderboard(req: Request, res: Response): Promise<Response> {
  const result = await leaderboardService.getLeaderboard();

  return res.status(mapStatusHTTP(result.status)).json(result.data);
}

export default {
  getleaderboard,
};
