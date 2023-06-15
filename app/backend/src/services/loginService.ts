// import * as bcrypt from 'bcryptjs';
// import jwtUtil from '../utils/jwtUtils';
import { signToken, TokenPayload } from '../utils/jwtUtils';
import UserModel from '../database/models/UserModel';
import { ServiceResponse } from '../types/serviceResponse';

async function login(email: string, _password: string): Promise<ServiceResponse<string>> {
  const host = await UserModel.findOne({ where: { email } });

  if (!host) return { status: 'invalid', data: { message: 'Invalid email or password' } };

  const token = signToken({ password: host.dataValues.password, email: host.dataValues.email });

  return { status: 'success', data: token };
}

async function getUserRole(token: TokenPayload): Promise<ServiceResponse<string>> {
  console.log('entrou service');
  console.log('token no service', token);

  const host = await UserModel.findOne({ where: { email: token.email } });

  if (!host) return { status: 'invalid', data: { message: 'No user' } };

  const { role } = host.dataValues;
  //   const token = signToken({ password: host.dataValues.password, email: host.dataValues.email });

  return { status: 'success', data: role };
}

export default {
  login,
  getUserRole,
};
