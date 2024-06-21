import faker, { name } from 'faker'
import { Response, Request } from 'express'
import { IEmployeeData } from '../src/api/types'

const employeeList: IEmployeeData [] = []
const employeeCount = 200

for (let i = 0; i < employeeCount; i++) {
  employeeList.push({
    id: i,
    companyId: 1,
    status: faker.random.arrayElement(['active', 'passive', 'deleted']),
    username: faker.name.findName(),
    employeeClass: faker.random.arrayElement(['1D', 'S12', '1C']),
    expenseCenter: faker.datatype.number({ min: 1000000000, max: 9000000000 }).toString(),
    salary: faker.finance.amount(),
    salaryType: faker.random.arrayElement(['DY', 'MO', 'YE', 'HO'])
  })
}

export const getEmployees = (req: Request, res: Response) => {
  const { username, status, salaryType, page = 1, limit = 20, sort } = req.query

  let mockList = employeeList.filter(item => {
    if (salaryType && item.salaryType !== salaryType) return false
    if (username && item.username.toLocaleLowerCase().indexOf((username as string).toLocaleLowerCase()) < 0) return false
    if (status && item.status !== status) return false
    return true
  })

  if (sort === '-id') {
    mockList = mockList.reverse()
  }

  const pageList = mockList.filter((_, index) => index < (limit as number) * (page as number) && index >= (limit as number) * (page as number - 1))

  return res.json({
    code: 20000,
    data: {
      total: mockList.length,
      items: pageList
    }
  })
}

export const createEmployee = (req: Request, res: Response) => {
  const { employee } = req.body
  return res.json({
    code: 20000,
    data: {
      employee
    }
  })
}

export const updateEmployee = (req: Request, res: Response) => {
  const { id } = req.params
  const { employee } = req.body
  for (const v of employeeList) {
    if (v.id.toString() === id) {
      return res.json({
        code: 20000,
        data: {
          employee
        }
      })
    }
  }
  return res.json({
    code: 70001,
    message: 'Employee not found'
  })
}

export const deleteEmployee = (req: Request, res: Response) => {
  return res.json({
    code: 20000
  })
}
