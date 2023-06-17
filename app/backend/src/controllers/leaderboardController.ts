import { Request, Response } from 'express';
import leaderboardService from '../services/leaderboardService';
import mapStatusHTTP from '../utils/mapStatusHTTP';

async function getleaderboard(req: Request, res: Response): Promise<Response> {
  const { path } = req;
  let homeOrAway: string;

  if (path.endsWith('/home')) {
    homeOrAway = 'homeTeamId';
  } else if (path.endsWith('/away')) {
    homeOrAway = 'awayTeamId';
  } else {
    // Rota inválida, trate o erro adequadamente
    homeOrAway = '';
  }

  const result = await leaderboardService.getLeaderboard(homeOrAway);

  return res.status(mapStatusHTTP(result.status)).json(result.data);
}

export default {
  getleaderboard,
};
