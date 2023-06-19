import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import TeamModel from '../database/models/TeamModel';

import { Response } from 'superagent';
import IGetMatch from '../Interfaces/IGetMatch';
import MatchModel from '../database/models/MatchModel';
import {
    allMatches,
    allMatchesInProgress,
    createdMatch,
    createMatchInput,
    editedMatch,
    editMatchInput,
    finishedMatch,
    homeTeam,
    awayTeam, 
    matchToEdit} from './mocks/matchMocks';
import IMatch from '../Interfaces/IMatch';
import jwtUtils from '../utils/jwtUtils';
import { signToken, verifyToken } from '../utils/jwtUtils';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { decodedToken, getUser, token } from './mocks/userMocks';

chai.use(chaiHttp);

const { expect } = chai;

beforeEach(() => {
  sinon.restore();
});

describe('Verifica os casos de sucesso referentes aos endpoint referentes a matches', () => {
    let chaiHttpResponse: Response;

    describe('Verifica o endpoint /matches', () => {
        describe('Verifica o get', () => {
            it('Verifica se é possível pegar todas as partidas com sucesso', async () => {
                sinon
                .stub(MatchModel, 'findAll')
                .resolves(allMatches as unknown as MatchModel[]);

                chaiHttpResponse = await chai
                    .request(app)
                    .get('/matches');

                expect(chaiHttpResponse).to.have.status(200);
                expect(chaiHttpResponse.body).to.deep.equal(allMatches);
            });

            it('Verifica se é possível pegar todas as partidas filtradas com sucesso', async () => {
                sinon
                .stub(MatchModel, 'findAll')
                .resolves(allMatchesInProgress as unknown as MatchModel[]);

                chaiHttpResponse = await chai
                    .request(app)
                    .get('/matches')
                    .query({ inProgress: true });

                expect(chaiHttpResponse).to.have.status(200);
                expect(chaiHttpResponse.body).to.deep.equal(allMatchesInProgress);
            });
        });

        describe('Verifica o post', () => {
            it('Verifica se é possível cadastrar uma partida com sucesso', async () => {
                sinon
                .stub(MatchModel, 'create')
                .resolves(createdMatch as unknown as MatchModel);

                sinon.stub(jwt, 'verify').callsFake(() => {
                    return decodedToken;
                });
              
                sinon
                .stub(jwtUtils, 'verifyToken')
                .returns(decodedToken);

                sinon.stub(TeamModel, 'findOne')
                .onFirstCall().resolves(homeTeam as unknown as TeamModel)
                .onSecondCall().resolves(awayTeam as unknown as TeamModel);

                chaiHttpResponse = await chai
                    .request(app)
                    .post('/matches')
                    .send(createMatchInput)
                    .set('Authorization', 'token');

                expect(chaiHttpResponse).to.have.status(201);
                expect(chaiHttpResponse.body).to.deep.equal(createdMatch.dataValues);
            });
        });
    });

    describe('Verifica o endpoint /matches/:id', () => {
        describe('Verifica o patch', () => {
            it('Verifica se é possível editar uma partida com sucesso', async () => {
                const match = new MatchModel();
                sinon
                .stub(MatchModel, 'findOne')
                .resolves(matchToEdit as unknown as MatchModel);

                sinon
                  .stub(MatchModel, 'update')
                  .resolves();

                // sinon.stub(match, 'update').callsFake(() => Promise.resolve(editedMatch as unknown as MatchModel));

                sinon.stub(jwt, 'verify').callsFake(() => {
                    return decodedToken;
                });
              
                sinon
                .stub(jwtUtils, 'verifyToken')
                .returns(decodedToken);

                chaiHttpResponse = await chai
                    .request(app)
                    .patch('/matches/20')
                    .send(editMatchInput)
                    .set('Authorization', 'token');

                expect(chaiHttpResponse).to.have.status(200);
                expect(chaiHttpResponse.body.message).to.be.equal('Finished');
            });
        });
    });

    describe('Verifica o endpoint /matches/:id/finish', () => {
        describe('Verifica o patch', () => {
            it('Verifica se é possível finalizar uma partida em andamento com sucesso', async () => {
                const match = new MatchModel();
                sinon
                .stub(MatchModel, 'findOne')
                .resolves(createdMatch as unknown as MatchModel);

                sinon
                .stub(match, 'update')
                .resolves(finishedMatch as unknown as MatchModel);

                sinon.stub(jwt, 'verify').callsFake(() => {
                    return decodedToken;
                });
              
                sinon
                .stub(jwtUtils, 'verifyToken')
                .returns(decodedToken);

                chaiHttpResponse = await chai
                    .request(app)
                    .patch('/matches/51/finish')
                    .set('Authorization', 'token');

                expect(chaiHttpResponse).to.have.status(200);
                expect(chaiHttpResponse.body.message).to.be.equal('Finished');
            });
        });
    });
});

describe('Verifica os casos de falha referentes aos endpoints referentes a matches', () => {
    let chaiHttpResponse: Response;

    describe('Verifica o endpoint /matches', () => {
        // describe('Verifica o get com filtro', () => {
            // SE CRIAR LÓGICA DE FALHAS ACRESCENTAR
        // });

        describe('Verifica o post', () => {
            it('Verifica se o time da casa foi informado', async () => {
                chaiHttpResponse = await chai
                    .request(app)
                    .post('/matches')
                    .send({
                        homeTeamGoals: 7,
                        awayTeamId: 5,
                        awayTeamGoals: 1
                    });

                expect(chaiHttpResponse).to.have.status(400);
                expect(chaiHttpResponse.body.message).to.be('All fields must be filled');
            });

            it('Verifica se a quantidade de gols do time da casa foi informado', async () => {
                chaiHttpResponse = await chai
                    .request(app)
                    .post('/matches')
                    .send({
                        homeTeamId: 3,
                        awayTeamId: 5,
                        awayTeamGoals: 1
                    });

                expect(chaiHttpResponse).to.have.status(400);
                expect(chaiHttpResponse.body.message).to.be('All fields must be filled');
            });

            it('Verifica se o time da fora foi informado', async () => {
                chaiHttpResponse = await chai
                    .request(app)
                    .post('/matches')
                    .send({
                        homeTeamId: 3,
                        homeTeamGoals: 7,
                        awayTeamGoals: 1
                    });

                expect(chaiHttpResponse).to.have.status(400);
                expect(chaiHttpResponse.body.message).to.be('All fields must be filled');
            });

            it('Verifica se a quantidade de gols do time de fora foi informado', async () => {
                chaiHttpResponse = await chai
                    .request(app)
                    .post('/matches')
                    .send({
                        homeTeamId: 3,
                        homeTeamGoals: 7,
                        awayTeamId: 5
                    });

                expect(chaiHttpResponse).to.have.status(400);
                expect(chaiHttpResponse.body.message).to.be('All fields must be filled');
            });

            it('Verifica se a partida é válida: Times informados são diferentes', async () => {
                chaiHttpResponse = await chai
                    .request(app)
                    .post('/matches')
                    .send({
                        homeTeamId: 1,
                        homeTeamGoals: 7,
                        awayTeamId: 1,
                        awayTeamGoals: 1
                    });

                expect(chaiHttpResponse).to.have.status(422);
                expect(chaiHttpResponse.body.message).to.be('It is not possible to create a match with two equal teams');
            });

            it('Verifica se a partida é válida: Times informados existem', async () => {
                sinon.stub(MatchModel, 'findOne')
                .onFirstCall().resolves(null)
                .onSecondCall().resolves(createdMatch as unknown as MatchModel);

                chaiHttpResponse = await chai
                    .request(app)
                    .post('/matches')
                    .send({
                        homeTeamId: 999,
                        homeTeamGoals: 7,
                        awayTeamId: 51,
                        awayTeamGoals: 1
                    });

                expect(chaiHttpResponse).to.have.status(404);
                expect(chaiHttpResponse.body.message).to.be('There is no team with such id!');
            });
        });
    });

    describe('Verifica o endpoint /matches/:id', () => {
        describe('Verifica o patch', () => {
            // VER QUESTÃO DO TOKEN
            it('Verifica se a partida existe', async () => {
                // ID
                sinon
                .stub(MatchModel, 'findOne')
                .resolves(null);

                chaiHttpResponse = await chai
                    .request(app)
                    .patch('/matches/999')
                    .send(editMatchInput);

                expect(chaiHttpResponse).to.have.status(400);
                expect(chaiHttpResponse.body.message).to.be.equal('No match found');
            });

            it('Verifica se a nova quantidade de gols do time da casa foi informada', async () => {
                chaiHttpResponse = await chai
                    .request(app)
                    .patch('/matches/51')
                    .send({
                        awayTeamGoals: 5,
                    });

                expect(chaiHttpResponse).to.have.status(400);
                expect(chaiHttpResponse.body.message).to.be.equal('All fields must be filled');
            });

            it('Verifica se a nova quantidade de gols do time de fora foi informada', async () => {
                chaiHttpResponse = await chai
                    .request(app)
                    .patch('/matches/51')
                    .send({
                        homeTeamGoals: 5,
                    });

                expect(chaiHttpResponse).to.have.status(400);
                expect(chaiHttpResponse.body.message).to.be.equal('All fields must be filled');
            });
        });
    });

    describe('Verifica o endpoint /matches/:id/finish', () => {
        describe('Verifica o patch', () => {
            // VER QUESTÃO DO TOKEN
            it('Verifica se a partida existe', async () => {
                // ID
                sinon
                .stub(MatchModel, 'findOne')
                .resolves(null);

                chaiHttpResponse = await chai
                    .request(app)
                    .patch('/matches/999/finish');

                expect(chaiHttpResponse).to.have.status(400);
                expect(chaiHttpResponse.body.message).to.be.equal('No match found');
            });
        });
    });
});