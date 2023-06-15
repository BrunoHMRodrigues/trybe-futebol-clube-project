// import * as bcrypt from 'bcryptjs';
// import jwtUtil from '../utils/jwtUtils';
import { signToken, TokenPayload } from '../utils/jwtUtils';
import UserModel from '../database/models/UserModel';
import { ServiceResponse } from '../types/serviceResponse';

async function login(email: string, _password: string): Promise<ServiceResponse<string>> {
  const host = await UserModel.findOne({ where: { email } });

  const hostData = (host as UserModel).dataValues;

  // if (!host) return { status: 'invalid', data: { message: 'Invalid email or password' } };

  const token = signToken({ password: hostData.password, email: hostData.email });
  // const token = signToken({ password: host.dataValues.password, email: host.dataValues.email });

  return { status: 'success', data: token };
}

async function getUserRole(token: TokenPayload): Promise<ServiceResponse<string>> {
  const host = await UserModel.findOne({ where: { email: token.email } });

  // if (!host) return { status: 'invalid', data: { message: 'No user' } };

  const { role } = (host as UserModel).dataValues;
  // const { role } = host.dataValues;

  return { status: 'success', data: role };
}

export default {
  login,
  getUserRole,
};
