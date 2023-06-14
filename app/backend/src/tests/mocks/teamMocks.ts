import { ServiceResponse } from "../../types/serviceResponse";
import { Team } from "../../types/Team";

const allTeams: Team[] = [
  {
    "id": 1,
    "teamName": "Avaí/Kindermann"
  },
  {
    "id": 2,
    "teamName": "Bahia"
  },
  {
    "id": 3,
    "teamName": "Botafogo"
  },
];

const getTeam = {
  "id": 1,
  "teamName": "Avaí/Kindermann"
}

const serviceSuccessGetAllTeams: ServiceResponse<Team[]> = {
  status: 'success',
  data: allTeams,
};

export {
  allTeams,
  getTeam,
  serviceSuccessGetAllTeams,
};
