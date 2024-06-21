import faker from 'faker'
import { Response, Request } from 'express'
import { Details, IVariableData } from '../src/api/types'

const variableList: IVariableData [] = []
const details: Details [] = []

variableList.push(
  {
    id: 1,
    title: 'Çıplak Maaş',
    type: 'variable',
    key: 'bare-salary',
    parent: '1',
    parenttype: 'Company',
    details: [
      {
        key: 'bare-salary-value',
        title: 'Çıplak Maaş',
        type: 'percent',
        value: '',
        includeSgk: true,
        isToWorkRate: true,
        anyRezerv: true,
        variableGroup: 'Maaş'
      },
      {
        key: 'employee-type',
        title: 'Personel Türü',
        type: 'text',
        value: 'Mavi Yaka'
      },
      {
        key: 'cost-center-group',
        title: 'Masraf Merkezi Grubu',
        type: 'text',
        value: '720'
      },
      {
        key: 'account-code',
        title: 'Hesap Kodu',
        type: 'text',
        value: '511628366'
      }
    ]
  })

export const getVariables = (req: Request, res: Response) => {
// const { } = req.query

  return res.json({
    code: 20000,
    data: {
      total: variableList.length,
      items: variableList
    }
  })
}

export const createVariable = (req: Request, res: Response) => {
  const { variable } = req.body

  variableList.push(variable)
  return res.json({
    code: 20000,
    data: {
      variable
    }
  })
}

export const updateVariable = (req: Request, res: Response) => {
  const { id } = req.params
  const { variable } = req.body
  for (const v of variableList) {
    if (v.id.toString() === id) {
      v.details = variable.details
      v.key = variable.key
      v.title = variable.title
      v.type = variable.title

      return res.json({
        code: 20000,
        data: {
          variable
        }
      })
    }
  }
  return res.json({
    code: 70001,
    message: 'parameter not found'
  })
}

export const deleteVariable = (req: Request, res: Response) => {
  const { id } = req.params

  for (let i = 0; i < variableList.length; i++) {
    if (variableList[i].id === Number(id)) {
      variableList.splice(i, 1)
    }
  }

  return res.json({
    code: 20000
  })
}
