import { User } from '../../types/User'

const getUser: { dataValues: User } = {
  dataValues: {
    id: 2,
    username: 'User',
    role: 'user',
    email: 'teste@teste.com',
    password: 'password',
  }
}

const decodedToken = {
  password: 'password',
  email: 'teste@test.com',
  iat: 1111111111,
}

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RlQHRlc3RlLmNvbSIsInBhc3N3b3JkIjoicGFzc3dvcmQiLCJpYXQiOjE2ODY4NjAyMjd9.o3ObfMnyUjQ2CBMKbjAi1eonqGur3E6ZCqIWWklrXT4'

export {
  getUser,
  decodedToken,
  token,
}