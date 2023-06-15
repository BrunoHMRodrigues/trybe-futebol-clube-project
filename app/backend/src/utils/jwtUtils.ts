import * as jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'secret';

export type TokenPayload = {
  email: string,
  password: string,
};

export function signToken(payload: TokenPayload): string {
  const token = jwt.sign(payload, secret);
  return token;
}

export function verifyToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, secret) as TokenPayload;
  return decoded;
}

// export default {
//   signToken,
//   verifyToken,
// };
