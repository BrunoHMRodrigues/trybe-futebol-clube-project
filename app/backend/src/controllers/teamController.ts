import { Request, Response } from 'express';
import teamService from '../services/teamService';
import mapStatusHTTP from '../utils/mapStatusHTTP';

async function getAllTeams(_req: Request, res: Response): Promise<Response> {
  const result = await teamService.getAllTeams();

  return res.status(mapStatusHTTP(result.status)).json(result.data);
}

async function getTeamById(req: Request, res: Response): Promise<Response> {
  const { id } = req.params;
  const result = await teamService.getTeamById(Number(id));

  return res.status(mapStatusHTTP(result.status)).json(result.data);
}

export default {
  getAllTeams,
  getTeamById,
};
