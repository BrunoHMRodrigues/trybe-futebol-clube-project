import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import TeamModel from '../database/models/TeamModel';

import { Response } from 'superagent';
import { allTeams, getTeam } from './mocks/teamMocks';

chai.use(chaiHttp);

const { expect } = chai;

beforeEach(() => {
  sinon.restore();
});

describe('Verifica os casos de sucesso referentes aos endpoint referentes a leaderboard', () => {
    describe('Verifica o endpoint /leaderboard/home', () => {
        it('Verifica se é possível pegar o leaderboard dos times da casa com sucesso', async () => {

        });
    });

    describe('Verifica o endpoint /leaderboard/away', () => {
        it('Verifica se é possível pegar o leaderboard dos times de fora com sucesso', async () => {

        });
    });

    describe('Verifica o endpoint /leaderboard', () => {
        it('Verifica se é possível pegar o leaderboard geral com sucesso', async () => {

        });
    });
});
