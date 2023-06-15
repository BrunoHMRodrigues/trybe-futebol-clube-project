import { Router } from 'express';
import loginController from '../controllers/loginController';
import loginMiddlewares from '../middlewares/loginMiddlewares';

const {
  verifyRequestData,
  verifyEmailRules,
  verifyEmailExists,
  verifyPassword,
  validateToken,
} = loginMiddlewares;

const loginRouter = Router();

loginRouter.post(
  '/',
  verifyRequestData,
  verifyEmailRules,
  verifyEmailExists,
  verifyPassword,
  //   validateToken,
  loginController.login,
);

loginRouter.get('/role', validateToken, loginController.getUserRole);

export default loginRouter;
