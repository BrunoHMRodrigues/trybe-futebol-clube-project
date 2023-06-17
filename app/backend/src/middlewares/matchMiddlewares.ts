import { Request, Response, NextFunction } from 'express';
// import MatchModel from '../database/models/MatchModel';
import TeamModel from '../database/models/TeamModel';
// import * as bcrypt from 'bcryptjs';
// import MatchModel from '../database/models/MatchModel';
import mapStatusHTTP from '../utils/mapStatusHTTP';
// import jwtUtils from '../utils/jwtUtils';

const verifyRequestDataToPatchMatch = (req: Request, res: Response, next: NextFunction) => {
  const { homeTeamGoals, awayTeamGoals } = req.body;

  if (!homeTeamGoals || !awayTeamGoals) {
    return res.status(mapStatusHTTP('notFound'))
      .json({ message: 'All fields must be filled' });
  }

  next();
};

const verifyRequestDataToCreateMatch = (req: Request, res: Response, next: NextFunction) => {
  const { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals } = req.body;

  if (!homeTeamId || !awayTeamId || !homeTeamGoals || !awayTeamGoals) {
    return res.status(mapStatusHTTP('notFound'))
      .json({ message: 'All fields must be filled' });
  }

  next();
};

const verifyTeams = async (req: Request, res: Response, next: NextFunction) => {
  const { homeTeamId, awayTeamId } = req.body;

  if (homeTeamId === awayTeamId) {
    return res.status(mapStatusHTTP('ruleInvalid'))
      .json({ message: 'It is not possible to create a match with two equal teams' });
  }

  const team1 = await TeamModel.findOne({ where: { id: homeTeamId } });
  const team2 = await TeamModel.findOne({ where: { id: awayTeamId } });

  if (!team1 || !team2) {
    return res.status(mapStatusHTTP('teamNotFound'))
      .json({ message: 'There is no team with such id!' });
  }

  next();
};

export default {
  verifyRequestDataToPatchMatch,
  verifyRequestDataToCreateMatch,
  verifyTeams,
};
