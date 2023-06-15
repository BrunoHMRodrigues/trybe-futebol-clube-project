import { Team } from '../types/Team';
import { ServiceResponse } from '../types/serviceResponse';
import TeamModel from '../database/models/TeamModel';

async function getAllTeams(): Promise<ServiceResponse<Team[]>> {
  const teams = await TeamModel.findAll();

  console.log('teams', teams);

  return { status: 'success', data: teams };
}

async function getTeamById(id: number): Promise<ServiceResponse<Team>> {
  const team = await TeamModel.findOne({ where: { id } });

  if (!team) return { status: 'notFound', data: { message: 'Team was not found' } };

  return { status: 'success', data: team };
}

export default { getAllTeams, getTeamById };
