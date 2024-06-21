import faker, { fake } from 'faker'
import { Response, Request } from 'express'
import { ICompanyData } from '../src/api/types'

const companyList: ICompanyData [] = []
const companyCount = 5

for (let i = 0; i < companyCount; i++) {
  companyList.push({
    id: i,
    status: faker.random.arrayElement(['active', 'passive', 'deleted']),
    companyname: faker.company.companyName(),
    address: faker.address.streetAddress() + faker.address.city() + faker.address.country(),
    vkn: faker.datatype.number({ min: 10000, max: 90000 }).toString(),
    substation: faker.company.suffixes() + ' ' + faker.company.companyName(),
    logoUrl: 'favicon.ico'
  })
}

export const getCompanies = (req: Request, res: Response) => {
  const { companyname, status, address, vkn, page = 1, limit = 20, sort } = req.query

  let mockList = companyList.filter(item => {
    if (vkn && item.vkn.toLocaleLowerCase().indexOf((vkn as string).toLocaleLowerCase()) < 0) return false
    if (address && item.address.toLocaleLowerCase().indexOf((address as string).toLocaleLowerCase()) < 0) return false
    if (companyname && item.companyname.toLocaleLowerCase().indexOf((companyname as string).toLocaleLowerCase()) < 0) return false
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

export const getCompanyById = (req: Request, res: Response) => {
  const { id } = req.query

  const mockList = companyList.filter(item => item.id === id as any)

  return res.json({
    code: 20000,
    data: mockList
  })
}

export const createCompany = (req: Request, res: Response) => {
  const { company } = req.body
  return res.json({
    code: 20000,
    data: {
      company
    }
  })
}

export const updateCompany = (req: Request, res: Response) => {
  const { id } = req.params
  const { company } = req.body
  for (const v of companyList) {
    if (v.id.toString() === id) {
      return res.json({
        code: 20000,
        data: {
          company
        }
      })
    }
  }
  return res.json({
    code: 70001,
    message: 'Company not found'
  })
}

export const deleteCompanies = (req: Request, res: Response) => {
  return res.json({
    code: 20000
  })
}
