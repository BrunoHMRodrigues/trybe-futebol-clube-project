import { User } from '../../types/User'

const getUser: User = {
  id: 2,
  username: 'User',
  role: 'user',
  email: 'user@user.com',
  password: 'secret_user',
}

const decodedToken = {
  password: 'password',
  email: 'teste@Test.com',
  iat: 1111111111,
}

export {
  getUser,
  decodedToken,
}