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

describe('Verifica os casos de sucesso referentes aos endpoint referentes a matches', () => {
    describe('Verifica o endpoint /matches', () => {
        describe('Verifica o get', () => {
            it('Verifica se é possível pegar todas as partidas com sucesso', async () => {

            });

            it('Verifica se é possível pegar todas as partidas filtradas com sucesso', async () => {

            });
        });

        describe('Verifica o post', () => {
            it('Verifica se é possível cadastrar uma partida com sucesso', async () => {

            });
        });
    });

    describe('Verifica o endpoint /matches/:id', () => {
        describe('Verifica o patch', () => {
            it('Verifica se é possível editar uma partida com sucesso', async () => {

            });
        });
    });

    describe('Verifica o endpoint /matches/:id/finish', () => {
        describe('Verifica o patch', () => {
            it('Verifica se é possível finalizar uma partida em andamento com sucesso', async () => {

            });
        });
    });
});

describe('Verifica os casos de falha referentes aos endpoints referentes a matches', () => {
    describe('Verifica o endpoint /matches', () => {
        describe('Verifica o get com filtro', () => {

        });

        describe('Verifica o post', () => {
            it('Verifica se o time da casa foi informado', async () => {

            });

            it('Verifica se a quantidade de gols do time da casa foi informado', async () => {

            });

            it('Verifica se o time da fora foi informado', async () => {

            });

            it('Verifica se a quantidade de gols do time de fora foi informado', async () => {

            });

            it('Verifica se a partida é válida: Times informados são diferentes', async () => {

            });
        });
    });

    describe('Verifica o endpoint /matches/:id', () => {
        describe('Verifica o patch', () => {
            // VER QUESTÃO DO TOKEN
            it('Verifica se a partida existe', async () => {
                // ID
            });

            it('Verifica se a nova quantidade de gols do time da casa foi informada', async () => {

            });

            it('Verifica se a nova quantidade de gols do time de fora foi informada', async () => {

            });
        });
    });

    describe('Verifica o endpoint /matches/:id/finish', () => {
        describe('Verifica o patch', () => {
            // VER QUESTÃO DO TOKEN
            it('Verifica se a partida existe', async () => {
                // ID
            });
        });
    });
});