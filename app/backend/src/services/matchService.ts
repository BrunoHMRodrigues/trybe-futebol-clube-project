import { ServiceResponse } from '../types/serviceResponse';
import MatchModel from '../database/models/MatchModel';
import TeamModel from '../database/models/TeamModel';
import IMatch from '../Interfaces/IMatch';

async function getAllMatches(): Promise<ServiceResponse<IMatch[]>> {
  const matches = await MatchModel.findAll({
    include: [
      { model: TeamModel, as: 'homeTeam', attributes: ['teamName'] },
      { model: TeamModel, as: 'awayTeam', attributes: ['teamName'] },
    ],
  });

  return { status: 'success', data: matches };
}

async function getMatchesInProgress(inProgress: boolean): Promise<ServiceResponse<IMatch[]>> {
  const matches = await MatchModel.findAll({
    where: { inProgress },
    include: [
      { model: TeamModel, as: 'homeTeam', attributes: ['teamName'] },
      { model: TeamModel, as: 'awayTeam', attributes: ['teamName'] },
    ],
  });

  return { status: 'success', data: matches };
}

export default { getAllMatches, getMatchesInProgress };
