import { ServiceResponse } from '../types/serviceResponse';
import MatchModel from '../database/models/MatchModel';
import TeamModel from '../database/models/TeamModel';
import IMatch from '../Interfaces/IMatch';
import IMessage from '../Interfaces/IMessage';

const noMatchFound = 'No match found';

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

  if (!match) return { status: 'notFound', data: { message: noMatchFound } };

  await match.update({ inProgress: false }, { fields: ['inProgress'] });
  return { status: 'success', data: { message: 'Finished' } };
}

async function updateMatch(
  id: number,
  homeTeamGoals: number,
  awayTeamGoals: number,
): Promise<ServiceResponse<IMessage>> {
  const match = await MatchModel.findOne({ where: { id } });

  if (!match) return { status: 'notFound', data: { message: noMatchFound } };

  console.log('VAI ENTRAR NO UPDATE');

  await MatchModel.update(
    { homeTeamGoals, awayTeamGoals },
    { where: { id } },
  );
  console.log('PASSOU DO UPDATE');

  return { status: 'success', data: { message: 'Finished' } };
}

async function createMatch(
  homeTeamId: number,
  awayTeamId: number,
  homeTeamGoals: number,
  awayTeamGoals: number,
): Promise<ServiceResponse<IMatch>> {
  const match = await MatchModel.create({
    id: 0,
    homeTeamId,
    awayTeamId,
    homeTeamGoals,
    awayTeamGoals,
    inProgress: true,
  });

  return { status: 'created', data: match.dataValues };
}

export default {
  getAllMatches,
  getMatchesInProgress,
  endMatch,
  updateMatch,
  createMatch,
};
