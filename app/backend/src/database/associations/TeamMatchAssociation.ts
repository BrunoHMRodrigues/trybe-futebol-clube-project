import MatchModel from '../models/MatchModel';
import TeamModel from '../models/TeamModel';

TeamModel.belongsTo(MatchModel, { foreignKey: 'id', as: 'homeTeam' });
TeamModel.belongsTo(MatchModel, { foreignKey: 'id', as: 'awayTeam' });

MatchModel.hasMany(TeamModel, { foreignKey: 'homeTeamId', as: 'homeTeams' });
MatchModel.hasMany(TeamModel, { foreignKey: 'awayTeamId', as: 'awayTeams' });
