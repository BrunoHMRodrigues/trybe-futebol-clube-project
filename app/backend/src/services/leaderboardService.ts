// import { Op } from 'sequelize';
import MatchModel from '../database/models/MatchModel';
// import { Team } from '../types/Team';
import { ServiceResponse } from '../types/serviceResponse';
import TeamModel from '../database/models/TeamModel';
import ITeam from '../Interfaces/ITeam';
import ILeaderboard from '../Interfaces/ILeaderboard';
import IMatch from '../Interfaces/IMatch';

function filterMatchesByHomeOrAway(
  matches: IMatch[],
  homeOrAway: string,
  teamId: number,
): IMatch[] {
  if (!homeOrAway) {
    return matches;
  }

  return matches.filter((match: IMatch) => match[homeOrAway as keyof IMatch] === teamId);
}

async function getMatches(homeOrAway: string, teamId: number): Promise<IMatch[]> {
  const matches = await MatchModel.findAll({
    where: {
      inProgress: false,
      // [homeOrAway]: teamId,
    },
  });

  // if (!homeOrAway) return matches;

  // const filteredMatches = matches.filter((match: IMatch) => match[homeOrAway] === teamId);

  // return filteredMatches;

  return filterMatchesByHomeOrAway(matches, homeOrAway, teamId);
}

interface TeamStats {
  totalVictories: number;
  totalLosses: number;
  totalDraws: number;
  goalsFavor: number;
  goalsOwn: number;
  totalGames: number;
}

function calculateTeamStats(matches: IMatch[], teamId: number): TeamStats {
  let totalGames = 0; let totalVictories = 0; let totalDraws = 0;
  let totalLosses = 0; let goalsFavor = 0; let goalsOwn = 0;

  matches.forEach((match: IMatch) => {
    // CASO TIME DA CASA OU DE FORA NÃO CORRESPONDA COM O TIME: PULAR PARA PRÓXIMO LOOP
    if (match.homeTeamId !== teamId && match.awayTeamId !== teamId) return;

    // PEGAR SE O TIME EM QUESTÃO É DE CASA OU DE FORA
    const teamIsHomeOrAway = match.homeTeamId === teamId ? 'homeTeam' : 'awayTeam';
    const otherTeam = teamIsHomeOrAway === 'homeTeam' ? 'awayTeam' : 'homeTeam';

    // INCREMENTANDO OS ATRIBUTOS
    const myTeamGoals = match[`${teamIsHomeOrAway}Goals`];
    const otherTeamGoals = match[`${otherTeam}Goals`];
    totalGames += 1;
    // goalsFavor += match[`${teamIsHomeOrAway}Goals`];
    // goalsOwn += match[`${otherTeam}Goals`];
    goalsFavor += myTeamGoals;
    goalsOwn += otherTeamGoals;
    if (myTeamGoals > otherTeamGoals) totalVictories += 1;
    else if (myTeamGoals < otherTeamGoals) totalLosses += 1;
    else totalDraws += 1;
  });

  return { totalGames, goalsFavor, goalsOwn, totalVictories, totalLosses, totalDraws };
}

function createLeaderboardInfo(name: string, stats: TeamStats): ILeaderboard {
  const { totalGames, goalsFavor, goalsOwn, totalVictories, totalLosses, totalDraws } = stats;

  const totalPoints = totalVictories * 3 + totalLosses * 0 + totalDraws * 1;

  const goalsBalance = goalsFavor - goalsOwn;
  const efficiency = `${((totalPoints / (totalGames * 3)) * 100).toFixed(2)}`;

  return {
    name,
    totalPoints,
    totalGames,
    totalVictories,
    totalDraws,
    totalLosses,
    goalsFavor,
    goalsOwn,
    goalsBalance,
    efficiency,
  };
}

function sortLeaderboard(leaderboard: ILeaderboard[]): ILeaderboard[] {
  leaderboard.sort((a, b) => {
    if (a.totalPoints !== b.totalPoints) {
      // Ordenar por total de pontos (decrescente)
      return b.totalPoints - a.totalPoints;
    } if (a.totalVictories !== b.totalVictories) {
      // Ordenar por total de vitórias (decrescente)
      return b.totalVictories - a.totalVictories;
    } if (a.goalsBalance !== b.goalsBalance) {
      // Ordenar por saldo de gols (decrescente)
      return b.goalsBalance - a.goalsBalance;
    }
    // Ordenar por gols a favor (decrescente)
    return b.goalsFavor - a.goalsFavor;
  });

  return leaderboard;
}

async function getLeaderboard(homeOrAway: string): Promise<ServiceResponse<ILeaderboard[]>> {
  const teams = await TeamModel.findAll();

  const leaderboardPromises = teams.map(async (team: ITeam) => {
    const { id: teamId, teamName: name } = team;

    const matches = await getMatches(homeOrAway, teamId);
    const teamStats = calculateTeamStats(matches, teamId);
    const leaderboardInfo = createLeaderboardInfo(name, teamStats);

    return leaderboardInfo;
  });

  const leaderboard = await Promise.all(leaderboardPromises);

  const sortedLeaderboard = sortLeaderboard(leaderboard);

  return { status: 'success', data: sortedLeaderboard };
}

// async function getMatches(teamId: number): Promise<IMatch[]> {
//   const matches = await MatchModel.findAll({
//     where: {
//       inProgress: false,
//       [Op.or]: [
//         { homeTeamId: teamId },
//         { awayTeamId: teamId },
//       ],
//     },
//   });
//   return matches;
// }

// async function getLeaderboard(): Promise<ServiceResponse<ILeaderboard[]>> {
//   const teams = await TeamModel.findAll();

//   const leaderboardPromises = teams.map(async (team: ITeam) => {
//     const { id: teamId, teamName: name } = team;

//     let totalGames = 0;
//     let totalVictories = 0;
//     let totalDraws = 0;
//     let totalLosses = 0;
//     let goalsFavor = 0;
//     let goalsOwn = 0;

//     const matches = await getMatches(teamId);

//     matches.forEach((match: IMatch) => {
//       const teamIshomeOrAway = match.homeTeamId === teamId ? 'homeTeam' : 'awayTeam';
//       const otherTeam = teamIshomeOrAway === 'homeTeam' ? 'awayTeam' : 'homeTeam';

//       totalGames += 1;

//       const goalsScored = match[`${teamIshomeOrAway}Goals`];
//       const goalsTaken = match[`${otherTeam}Goals`];

//       goalsFavor += goalsScored;
//       goalsOwn += goalsTaken;
//       if (goalsScored > goalsTaken) {
//         totalVictories += 1;
//       } else if (goalsScored < goalsTaken) {
//         totalLosses += 1;
//       } else {
//         totalDraws += 1;
//       }
//     });

//     const totalPoints = totalVictories * 3 + totalLosses * 0 + totalDraws * 1;
//     const goalsBalance = goalsFavor - goalsOwn;
//     const efficiency = `${((totalPoints / (totalGames * 3)) * 100).toFixed(2)}%`;

//     const leaderboardInfo: ILeaderboard = {
//       name,
//       totalPoints,
//       totalGames,
//       totalVictories,
//       totalDraws,
//       totalLosses,
//       goalsFavor,
//       goalsOwn,
//       goalsBalance,
//       efficiency,
//     };

//     return leaderboardInfo;
//   });

//   const leaderboard = await Promise.all(leaderboardPromises);

//   return { status: 'success', data: leaderboard };
// }

export default { getLeaderboard };
