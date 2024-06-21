import faker from 'faker'
import { Response, Request } from 'express'
import { asyncRoutes, constantRoutes, asyncPeoplingRoutes } from './routes'
import { IRoleData } from '../../src/api/types'

const routes = [...constantRoutes, ...asyncRoutes, ...asyncPeoplingRoutes]
const roles: IRoleData[] = [
  {
    key: 'developer-admin',
    name: 'developer admin',
    description: 'Super Administrator. Have access to view all pages.',
    routes: routes
  },
  {
    key: 'peopling-admin',
    name: 'peopling admin',
    description: 'Super Administrator. Have access to view all pages.',
    routes: asyncPeoplingRoutes // Just a mock
  },
  {
    key: 'editor',
    name: 'editor',
    description: 'Normal Editor. Can see all pages except permission page',
    routes: routes.filter(i => i.path !== '/permission') // Just a mock
  },
  {
    key: 'visitor',
    name: 'visitor',
    description: 'Just a visitor. Can only see the dashboard',
    routes: [{
      path: '',
      redirect: 'dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          meta: { title: 'dashboard', icon: 'dashboard' }
        }
      ]
    }]
  }
]

export const getRoles = (req: Request, res: Response) => {
  return res.json({
    code: 20000,
    data: {
      total: roles.length,
      items: roles
    }
  })
}

export const createRole = (req: Request, res: Response) => {
  const { role } = req.body

  role.key = role.name.toString().replace(/\s/g, '-').toLowerCase() // faker.datatype.number({ min: 3, max: 10000 })
  roles.push(role)

  const metaRoleList = []
  const newRoleKey = role.key
  metaRoleList.push(newRoleKey)

  role.routes.forEach((item: any): void => {
    routes.forEach(route => {
      const currentRoles = ((route?.meta) as any)?.roles as string[]
      if (currentRoles) {
        if (route?.path !== undefined && item?.path !== undefined && route?.path === item?.path) {
          // yetkisi olan path'ler
          currentRoles.push(newRoleKey)
        }
      } else {
        // hiç rol yok rol ekle
      }
    })
  })
  console.log(routes.filter(x => x.path === '/employee-management')[0].meta)

  return res.json({
    code: 20000,
    data: {
      key: role.key
    }
  })
}

export const updateRole = (req: Request, res: Response) => {
  const { role } = req.body
  console.log(role)
  for (let index = 0; index < roles.length; index++) {
    if (roles[index].key === role.key) {
      roles.splice(index, 1, Object.assign({}, role))
      return res.json({
        code: 20000,
        data: {
          role
        }
      })
    }
  }
  return res.json({
    code: 70001,
    message: 'Employee not found'
  })
}

export const deleteRole = (req: Request, res: Response) => {
  const { id } = req.params

  console.log(req.params)
  for (let i = 0; i < roles.length; i++) {
    if (roles[i].key === id) {
      roles.splice(i, 1)
    }
  }
  return res.json({
    code: 20000
  })
}

export const getRoutes = (req: Request, res: Response) => {
  return res.json({
    code: 20000,
    data: {
      routes
    }
  })
}
