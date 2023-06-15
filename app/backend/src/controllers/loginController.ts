import { Request, Response } from 'express';
import loginService from '../services/loginService';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import { verifyToken } from '../utils/jwtUtils';

async function login(req: Request, res: Response): Promise<Response> {
  const { email, password } = req.body;

  const result = await loginService.login(email, password);

  if (result.status !== 'success') {
    return res
      .status(mapStatusHTTP(result.status)).json(result.data);
  }

  return res.status(mapStatusHTTP(result.status)).json({ token: result.data });
}

async function getUserRole(req: Request, res: Response): Promise<Response> {
  console.log('entrou controller');
  const { authorization } = req.headers;
  const decodedToken = verifyToken(authorization as string);

  const result = await loginService.getUserRole(decodedToken);
  console.log('result controller', result);

  if (result.status !== 'success') {
    return res
      .status(mapStatusHTTP(result.status)).json(result.data);
  }
  console.log('chegou ao final do controller');

  return res.status(mapStatusHTTP(result.status)).json({ role: result.data });
}

export default {
  login,
  getUserRole,
};
