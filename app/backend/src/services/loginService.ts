// import * as bcrypt from 'bcryptjs';
// import jwtUtil from '../utils/jwtUtils';
import { signToken } from '../utils/jwtUtils';
import UserModel from '../database/models/UserModel';
import { ServiceResponse } from '../types/serviceResponse';

async function login(email: string, _password: string): Promise<ServiceResponse<string>> {
  const host = await UserModel.findOne({ where: { email } });

  if (!host) return { status: 'invalid', data: { message: 'Invalid email or password' } };

  const token = signToken({ password: host.dataValues.password, email: host.dataValues.email });

  return { status: 'success', data: token };
}

export default {
  login,
};
