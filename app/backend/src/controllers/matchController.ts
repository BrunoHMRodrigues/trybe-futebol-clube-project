import { Request, Response } from 'express';
import matchService from '../services/matchService';
import mapStatusHTTP from '../utils/mapStatusHTTP';

async function getMatches(req: Request, res: Response): Promise<Response> {
  const { inProgress } = req.query;

  if (!inProgress) {
    const result = await matchService.getAllMatches();

    return res.status(mapStatusHTTP(result.status)).json(result.data);
  }

  const isInProgress = inProgress === 'true';
  const result = await matchService.getMatchesInProgress(isInProgress);

  return res.status(mapStatusHTTP(result.status)).json(result.data);
}

async function endMatch(req: Request, res: Response): Promise<Response> {
  const { id } = req.params;

  const result = await matchService.endMatch(Number(id));

  return res.status(mapStatusHTTP(result.status)).json(result.data);
}

export default {
  getMatches,
  endMatch,
};
