import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import UserModel from '../database/models/UserModel';

import { Response } from 'superagent';
import loginService from '../services/loginService';
import jwtUtils from '../utils/jwtUtils';
import { signToken, verifyToken } from '../utils/jwtUtils';
import { decodedToken, getUser } from './mocks/userMocks';

chai.use(chaiHttp);

const { expect } = chai;

beforeEach(() => {
  sinon.restore();
});

describe('Verifica o funcionamento com sucesso dos endpoints referentes a login', () => {
  let chaiHttpResponse: Response;

  describe('Verifica o endpoint /login', () => {
    it('Verifica se é possível fazer login', async () => {
      sinon
        .stub(UserModel, 'findOne')
        .resolves(getUser as unknown as UserModel);
  
      sinon
        .stub(jwtUtils, 'signToken')
        .returns('token');
  
      chaiHttpResponse = await chai
        .request(app)
        .get('/login')
        .send({
          "email": "teste@teste.com",
          "password": "password"
        });
  
      expect(chaiHttpResponse).to.have.status(200);
      expect(chaiHttpResponse.body).to.deep.equal('token');
    });
  })

  describe('Verifica o endpoint /login/role', () => {
    it('Verifica se é possível pegar a role do usuário logado', async () => {
      sinon
        .stub(UserModel, 'findOne')
        .resolves(getUser as unknown as UserModel);
  
        sinon
        .stub(jwtUtils, 'verifyToken')
        .returns(decodedToken);
  
      chaiHttpResponse = await chai
        .request(app)
        .get('/login/role')
        .set('Authorization', 'token');
  
      expect(chaiHttpResponse).to.have.status(200);
      expect(chaiHttpResponse.body.role).to.deep.equal('user');
    });
  })
});

describe('Verifica o funcionamento dos casos de falha dos endpoints referentes a login', () => {
  let chaiHttpResponse: Response;

  describe('Verifica o endpoint /login', () => {
    describe('Verifica casos de emails informados inválidos', () => {
      it('Verifica se é recebido a mensagem de erro caso não seja informado o email', async () => {
        chaiHttpResponse = await chai
          .request(app)
          .get('/login')
          .send({
            "password": "password"
          });
    
        expect(chaiHttpResponse).to.have.status(400);
        expect(chaiHttpResponse.body.message).to.deep.equal('All fields must be filled');
      });

      it('Verifica se é recebido a mensagem de erro caso o email informado não esteja em um formato adequado', async () => {    
        chaiHttpResponse = await chai
          .request(app)
          .get('/login')
          .send({
            "email": "teste@teste",
            "password": "password"
          });
    
        expect(chaiHttpResponse).to.have.status(401);
        expect(chaiHttpResponse.body.message).to.deep.equal('Invalid email or password');
      });
  
      it('Verifica se é recebido a mensagem de erro caso o email informado não exista no banco de dados', async () => {   
        sinon
        .stub(UserModel, 'findOne')
        .resolves(undefined);
  
        sinon
          .stub(jwtUtils, 'signToken')
          .returns('token');
  
        chaiHttpResponse = await chai
          .request(app)
          .get('/login')
          .send({
            "email": "nao@existo.com",
            "password": "password"
          });
    
        expect(chaiHttpResponse).to.have.status(401);
        expect(chaiHttpResponse.body.message).to.be.equal('Invalid email or password');
      });      
    })

    describe('Verifica casos de password informados inválidos', () => {
      it('Verifica se é recebido a mensagem de erro caso não seja informado o password', async () => {  
        chaiHttpResponse = await chai
          .request(app)
          .get('/login')
          .send({
            "email": "teste@teste.com"
          });
    
        expect(chaiHttpResponse).to.have.status(400);
        expect(chaiHttpResponse.body.message).to.deep.equal('All fields must be filled');
      });

      it('Verifica se é recebido a mensagem de erro caso o password tenha menos de 6 caracteres', async () => {  
        chaiHttpResponse = await chai
          .request(app)
          .get('/login')
          .send({
            "email": "teste@teste.com",
            "password": "fail"
          });
    
        expect(chaiHttpResponse).to.have.status(401);
        expect(chaiHttpResponse.body.message).to.deep.equal('Invalid email or password');
      });
    })    
  })

  describe('Verifica o endpoint /login/role', () => {
    let chaiHttpResponse: Response;
    
  })
});
