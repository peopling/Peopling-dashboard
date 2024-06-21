export interface IArticleData {
  id: number
  status: string
  title: string
  abstractContent: string
  fullContent: string
  sourceURL: string
  imageURL: string
  timestamp: string | number
  platforms: string[]
  disableComment: boolean
  importance: number
  author: string
  reviewer: string
  type: string
  pageviews: number
}

export interface IEmployeeData {
  id: number
  companyId: number
  username: string
  salary:string
  salaryType: string
  expenseCenter: string
  employeeClass: string
  status: string
}

export interface ICompanyData {
  id: number
  companyname: string
  vkn: string
  address: string
  status: string
  logoUrl: string
  substation: string
}

export interface IRoleData {
  key: string
  name: string
  description: string
  routes: any
}

export interface ITransactionData {
  orderId: string
  timestamp: string | number
  username: string
  price: number
  status: string
}

export interface IUserData {
  id: number
  username: string
  password: string
  name: string
  email: string
  phone: string
  avatar: string
  introduction: string
  roles: string[]
  status: string
}

export interface IParameterData {
  id: number
  title: string
  type: string
  key: string
  year?: string
  parent: string
  parenttype: string
  // eslint-disable-next-line no-use-before-define
  details: Details[]
}

export interface IVariableData{
  id: number
  title: string
  type: string
  key: string
  year?: string
  parent: string
  parenttype: string
  // eslint-disable-next-line no-use-before-define
  details: Details[]
}

export interface Details {
  key: string
  title: string
  type: string
  value: string
  includeSgk?: boolean
  isToWorkRate?: boolean
  anyRezerv?: boolean
  variableGroup?: string
}

export interface IBudgetData {
  id: number
  name: string
  status: string
}
