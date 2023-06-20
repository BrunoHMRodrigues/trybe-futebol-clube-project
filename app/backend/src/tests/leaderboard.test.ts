import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import TeamModel from '../database/models/TeamModel';

import { Response } from 'superagent';
import { allTeams  } from './mocks/teamMocks';
import { allMatches, allMatchesFinished } from './mocks/matchMocks';
import { leaderboardHome, leaderboardAway, leaderboardGeneral } from './mocks/leaderboardMocks';
import MatchModel from '../database/models/MatchModel';

chai.use(chaiHttp);

const { expect } = chai;

beforeEach(() => {
  sinon.restore();
});

describe('Verifica os casos de sucesso referentes aos endpoint referentes a leaderboard', () => {
    let chaiHttpResponse: Response;

    describe('Verifica o endpoint /leaderboard/home', () => {
        it('Verifica se é possível pegar o leaderboard dos times da casa com sucesso', async () => {
            sinon
            .stub(TeamModel, 'findAll')
            .resolves(allTeams as unknown as TeamModel[]);

            sinon
            .stub(MatchModel, 'findAll')
            .resolves(allMatchesFinished as unknown as MatchModel[]);

                chaiHttpResponse = await chai
                    .request(app)
                    .get('/leaderboard/home');

                expect(chaiHttpResponse).to.have.status(200);
                expect(chaiHttpResponse.body).to.deep.equal(leaderboardHome);
        });
    });

    describe('Verifica o endpoint /leaderboard/away', () => {
        it('Verifica se é possível pegar o leaderboard dos times de fora com sucesso', async () => {
            sinon
            .stub(TeamModel, 'findAll')
            .resolves(allTeams as unknown as TeamModel[]);

            sinon
            .stub(MatchModel, 'findAll')
            .resolves(allMatchesFinished as unknown as MatchModel[]);

                chaiHttpResponse = await chai
                    .request(app)
                    .get('/leaderboard/away');

                expect(chaiHttpResponse).to.have.status(200);
                expect(chaiHttpResponse.body).to.deep.equal(leaderboardAway);
        });
    });

    describe('Verifica o endpoint /leaderboard', () => {
        it('Verifica se é possível pegar o leaderboard geral com sucesso', async () => {
            sinon
            .stub(TeamModel, 'findAll')
            .resolves(allTeams as unknown as TeamModel[]);

            sinon
            .stub(MatchModel, 'findAll')
            .resolves(allMatchesFinished as unknown as MatchModel[]);

                chaiHttpResponse = await chai
                    .request(app)
                    .get('/leaderboard');

                expect(chaiHttpResponse).to.have.status(200);
                expect(chaiHttpResponse.body).to.deep.equal(leaderboardGeneral);
        });
    });
});
