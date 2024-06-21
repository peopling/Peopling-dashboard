import faker from 'faker'
import { Response, Request } from 'express'
import { IUserData } from '../src/api/types'
import { AvatarGenerator } from 'random-avatar-generator'

const generator = new AvatarGenerator()
const userList: IUserData[] = [
  {
    id: 0,
    username: 'developer-admin',
    password: 'developer2022',
    name: 'Super Admin',
    avatar: generator.generateRandomAvatar('avatar'),
    introduction: 'I am a super administrator',
    email: 'admin@test.com',
    phone: '1234567890',
    roles: ['developer-admin'],
    status: 'active'
  },
  {
    id: 1,
    username: 'peopling-admin',
    password: 'peopling2022',
    name: 'peopling Admin User',
    avatar: generator.generateRandomAvatar('avatar'),
    introduction: 'I am a peopling administrator',
    email: 'peopling@test.com',
    phone: '1234567890',
    roles: ['peopling-admin'],
    status: 'active'
  },
  {
    id: 2,
    username: 'editor',
    password: '123456',
    name: 'Normal Editor',
    avatar: generator.generateRandomAvatar('avatar'),
    introduction: 'I am an editor',
    email: 'editor@test.com',
    phone: '1234567890111',
    roles: ['editor'],
    status: 'passive'
  }
]
const userCount = 5

for (let i = 3; i < userCount; i++) {
  userList.push({
    id: i,
    username: 'user_' + faker.random.alphaNumeric(9),
    password: faker.random.alphaNumeric(20),
    name: faker.name.findName(),
    avatar: generator.generateRandomAvatar('avatar'),
    introduction: faker.lorem.sentence(20),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber(),
    roles: ['visitor'],
    status: faker.random.arrayElement(['active', 'passive'])
  })
}

export const register = (req: Request, res: Response) => {
  return res.json({
    code: 20000
  })
}

export const login = (req: Request, res: Response) => {
  const { username, password } = req.body
  console.log(req.body)
  for (const user of userList) {
    if (user.username === username && user.password === password) {
      return res.json({
        code: 20000,
        data: {
          user: user,
          accessToken: username + '-token'
        }
      })
    }
  }
  return res.status(200).json({
    code: 50005,
    message: 'username or password is incorrect'
  })
}

export const logout = (req: Request, res: Response) => {
  return res.json({
    code: 20000
  })
}

export const getUsers = (req: Request, res: Response) => {
  const { name, status, page = 1, limit = 20, sort } = req.query

  let users = userList.filter(user => {
    const lowerCaseName = user.name.toLowerCase()
    if (status && user.status !== status) return false
    return !(name && lowerCaseName.indexOf((name as string).toLowerCase()) < 0)
  })

  if (sort === '-id') {
    users = userList.reverse()
  }

  const pageList = users.filter((_, index) => index < (limit as number) * (page as number) && index >= (limit as number) * (page as number - 1))

  return res.json({
    code: 20000,
    data: {
      total: pageList.length,
      items: pageList
    }
  })
}

export const createUser = (req: Request, res: Response) => {
  const { user } = req.body
  userList.push(user)
  return res.json({
    code: 20000,
    data: {
      user
    }
  })
}

export const getUserInfo = (req: Request, res: Response) => {
  let user = {}

  user = userList.filter(x => (x.username + '-token') === req.header('X-Access-Token'))[0]
  console.log(user)
  return res.json({
    code: 20000,
    data: {
      user: user
    }
  })
}

export const getUserByName = (req: Request, res: Response) => {
  const { username } = req.params
  for (const user of userList) {
    if (user.username === username) {
      return res.json({
        code: 20000,
        data: {
          user
        }
      })
    }
  }
  return res.status(400).json({
    code: 50004,
    message: 'Invalid User'
  })
}

export const updateUser = (req: Request, res: Response) => {
  const { username } = req.params
  const { user } = req.body
  for (let index = 0; index < userList.length; index++) {
    if (userList[index].id === user.id) {
      userList.splice(index, 1, Object.assign({}, user))
      return res.json({
        code: 20000,
        data: {
          user
        }
      })
    }
  }
  return res.status(400).json({
    code: 50004,
    message: 'Invalid User'
  })
}

export const deleteUser = (req: Request, res: Response) => {
  return res.json({
    code: 20000
  })
}
