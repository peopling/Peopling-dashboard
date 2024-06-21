import faker, { name } from 'faker'
import { Response, Request } from 'express'
import { IBudgetData } from '../src/api/types'

const budgetList: IBudgetData [] = []
const budgetCount = 200

for (let i = 0; i < budgetCount; i++) {
  budgetList.push({
    id: i,
    status: faker.random.arrayElement(['active', 'passive', 'deleted']),
    name: ''
  })
}

export const getBudgets = (req: Request, res: Response) => {
  const { status, page = 1, limit = 20, sort } = req.query

  let mockList = budgetList.filter(item => {
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

export const createBudget = (req: Request, res: Response) => {
  const { budget } = req.body
  return res.json({
    code: 20000,
    data: {
      budget
    }
  })
}

export const updateBudget = (req: Request, res: Response) => {
  const { id } = req.params
  const { budget } = req.body
  for (const v of budgetList) {
    if (v.id.toString() === id) {
      return res.json({
        code: 20000,
        data: {
          budget
        }
      })
    }
  }
  return res.json({
    code: 70001,
    message: 'Budget not found'
  })
}

export const deleteBudget = (req: Request, res: Response) => {
  return res.json({
    code: 20000
  })
}
