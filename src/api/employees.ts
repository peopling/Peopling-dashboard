import request from '@/utils/request'
import { IEmployeeData } from './types'

export const defaultEmployeeData: IEmployeeData = {
  id: 0,
  companyId: 0,
  username: '',
  salary: '',
  salaryType: '',
  expenseCenter: '',
  employeeClass: '',
  status: ''
}

export const getEmployees = (params: any) =>
  request({
    url: '/employees',
    method: 'get',
    params
  })

export const getEmployee = (id: number, params: any) =>
  request({
    url: `/employees/${id}`,
    method: 'get',
    params
  })

export const createEmployee = (data: any) =>
  request({
    url: '/employees',
    method: 'post',
    data
  })

export const updateEmployee = (id: number, data: any) =>
  request({
    url: `/employees/${id}`,
    method: 'put',
    data
  })

export const deleteEmployee = (id: number) =>
  request({
    url: `/Employees/${id}`,
    method: 'delete'
  })

export const getPageviews = (params: any) =>
  request({
    url: '/pageviews',
    method: 'get',
    params
  })
