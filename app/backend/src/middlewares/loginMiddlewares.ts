import { Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcryptjs';
import validateEmail from '../helpers/validateEmail';
import UserModel from '../database/models/UserModel';
import mapStatusHTTP from '../utils/mapStatusHTTP';
// import jwtUtils from '../utils/jwtUtils';
import { verifyToken, TokenPayload } from '../utils/jwtUtils';

const invalidData = 'Invalid email or password';

const verifyRequestData = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(mapStatusHTTP('notFound'))
      .json({ message: 'All fields must be filled' });
  }

  next();
};

const verifyEmailRules = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  const emailIsValid = validateEmail(email);

  if (!emailIsValid) {
    return res.status(mapStatusHTTP('invalid'))
      .json({ message: invalidData });
  }

  next();
};

const verifyEmailExists = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const host = await UserModel.findOne({ where: { email } });

  // REVER SE ISSO DEVERIA ESTAR NESSE MIDDLEWARE
  if (!host || !bcrypt.compareSync(password, host.dataValues.password)) {
    // return { status: 'invalid', data: { message: invalidData } };
    return res.status(mapStatusHTTP('invalid'))
      .json({ message: invalidData });
  }

  next();
};

const verifyPassword = (req: Request, res: Response, next: NextFunction) => {
  const { password } = req.body;

  if (password.length < 6) {
    return res.status(mapStatusHTTP('invalid'))
      .json({ message: invalidData });
  }

  next();
};

interface CustomRequest extends Request {
  payload?: TokenPayload;
}

const validateToken = (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(mapStatusHTTP('invalid')).json({ message: 'Token not found' });
    }
    console.log('vai entrar no verify');

    const decodedToken = verifyToken(authorization);

    console.log('DECODED TOKEN', decodedToken);
    req.payload = decodedToken;
  } catch (error) {
    return res.status(mapStatusHTTP('invalid')).json({
      message: 'Token must be a valid token',
    });
  }

  next();
};

export default {
  verifyRequestData,
  verifyEmailRules,
  verifyEmailExists,
  verifyPassword,
  validateToken,
};
