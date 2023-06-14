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

describe('Seu teste', () => {
  let chaiHttpResponse: Response;

  after(() => {
    sinon.restore();
  });

  it('Verifica se é possível pegar todos os times cadastrados', async () => {
    sinon
      .stub(TeamModel, 'findAll')
      .resolves(allTeams as unknown as TeamModel[]);

    chaiHttpResponse = await chai
      .request(app)
      .get('/teams');

    expect(chaiHttpResponse).to.have.status(200);
    expect(chaiHttpResponse.body).to.deep.equal(allTeams);

    sinon.restore();
  });

  it('Verifica se é possível pegar um time específico', async () => {
    sinon
      .stub(TeamModel, 'findOne')
      .resolves(getTeam as unknown as TeamModel);

    chaiHttpResponse = await chai
      .request(app)
      .get('/teams/1');

    expect(chaiHttpResponse).to.have.status(200);
    expect(chaiHttpResponse.body).to.deep.equal(getTeam);

    sinon.restore();
  });
});
