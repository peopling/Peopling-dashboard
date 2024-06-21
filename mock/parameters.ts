import faker from 'faker'
import { Response, Request } from 'express'
import { IParameterData, Details } from '../src/api/types'

const parameterList: IParameterData [] = []
const details: Details [] = []

parameterList.push({
  id: 1,
  title: 'sgk parametreleri',
  key: 'sgk-parameter',
  parent: faker.datatype.number({ min: 1, max: 1000 }).toString(),
  type: 'parameter',
  parenttype: 'Company',
  year: '2021',
  details: [{
    key: 'unemployment-rate',
    title: 'işsizlik oranı',
    type: 'percent',
    value: '2,00'
  },
  {
    key: 'sgk-rate',
    title: 'sgk oranı',
    type: 'percent',
    value: '15,50'
  },
  {
    key: 'sgk-ceiling-january',
    title: 'sgk tavanı ocak',
    type: 'money',
    value: '1500'
  },
  {
    key: 'sgk-ceiling-july',
    title: 'sgk tavanı temmuz',
    type: 'money',
    value: '1500'
  }]
},
{
  id: 2,
  title: 'Saatlik çalışma',
  type: 'parameter',
  key: 'hourly-work',
  year: '2021',
  parent: '1',
  parenttype: 'Company',
  details: [
    {
      key: 'ocak',
      title: 'Ocak',
      type: 'monay',
      value: '2000'
    },
    {
      key: 'subat',
      title: 'Şubat',
      type: 'monay',
      value: '2000'
    },
    {
      key: 'mart',
      title: 'Mart',
      type: 'monay',
      value: '2000'
    },
    {
      key: 'nisan',
      title: 'Nisan',
      type: 'monay',
      value: '2000'
    },
    {
      key: 'mayis',
      title: 'Mayıs',
      type: 'monay',
      value: '2000'
    }
  ]
},
{
  id: 3,
  title: 'Masraf Merkezi',
  type: 'parameter',
  key: 'cost-center',
  parent: '1',
  parenttype: 'Company',
  details: [
    {
      key: 'cost-center-no',
      title: 'Masraf Merkezi',
      type: 'text',
      value: '3202152654'
    },
    {
      key: 'cost-center-group',
      title: 'Masraf Merkezi Grubu',
      type: 'text',
      value: '720'
    }
  ]
},
{
  id: 4,
  title: 'Personel Türü',
  type: 'parameter',
  key: 'employee-type',
  parent: '1',
  parenttype: 'Company',
  details: [
    {
      key: 'employee-type',
      title: 'Personel Türü',
      type: 'text',
      value: 'Beyaz Yaka'
    },
    {
      key: 'employee-group',
      title: 'Personel Grubu',
      type: 'text',
      value: 'WC1'
    },
    {
      key: 'employee-class',
      title: 'Personel Sınıfı',
      type: 'text',
      value: '1C'
    }
  ]
})

export const getParameters = (req: Request, res: Response) => {
// const { } = req.query

  return res.json({
    code: 20000,
    data: {
      total: parameterList.length,
      items: parameterList
    }
  })
}

export const createParameter = (req: Request, res: Response) => {
  const { parameter } = req.body

  parameterList.push(parameter)
  return res.json({
    code: 20000,
    data: {
      parameter
    }
  })
}

export const updateParameter = (req: Request, res: Response) => {
  const { id } = req.params
  const { parameter } = req.body
  for (const v of parameterList) {
    if (v.id.toString() === id) {
      v.details = parameter.details
      v.key = parameter.key
      v.title = parameter.title
      v.type = parameter.title
      v.year = parameter.year
      return res.json({
        code: 20000,
        data: {
          parameter
        }
      })
    }
  }
  return res.json({
    code: 70001,
    message: 'parameter not found'
  })
}

export const deleteParameter = (req: Request, res: Response) => {
  const { id } = req.params

  for (let i = 0; i < parameterList.length; i++) {
    if (parameterList[i].id === Number(id)) {
      parameterList.splice(i, 1)
    }
  }

  return res.json({
    code: 20000
  })
}
