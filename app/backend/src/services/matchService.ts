import { ServiceResponse } from '../types/serviceResponse';
import MatchModel from '../database/models/MatchModel';
import TeamModel from '../database/models/TeamModel';
import IMatch from '../Interfaces/IMatch';
import IMessage from '../Interfaces/IMessage';

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

async function endMatch(id: number): Promise<ServiceResponse<IMessage>> {
  const match = await MatchModel.findOne({ where: { id } });

  if (!match) return { status: 'notFound', data: { message: 'No match founded' } };

  await match.update({ inProgress: false }, { fields: ['inProgress'] });
  return { status: 'success', data: { message: 'Finished' } };
}

export default {
  getAllMatches,
  getMatchesInProgress,
  endMatch,
};
