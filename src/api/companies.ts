import request from '@/utils/request'
import { ICompanyData } from './types'

export const defaultCompanyData: ICompanyData = {
  id: 0,
  companyname: '',
  vkn: '',
  address: '',
  status: '',
  logoUrl: '',
  substation: ''
}

export const getCompanies = (params: any) =>
  request({
    url: '/companies',
    method: 'get',
    params
  })

export const getCompany = (id: number, params: any) =>
  request({
    url: `/companies/${id}`,
    method: 'get',
    params
  })

export const createCompany = (data: any) =>
  request({
    url: '/companies',
    method: 'post',
    data
  })

export const updateCompany = (id: number, data: any) =>
  request({
    url: `/companies/${id}`,
    method: 'put',
    data
  })

export const deleteCompany = (id: number) =>
  request({
    url: `/companies/${id}`,
    method: 'delete'
  })

export const getPageviews = (params: any) =>
  request({
    url: '/pageviews',
    method: 'get',
    params
  })
