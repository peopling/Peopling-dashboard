import request from '@/utils/request'
import { IParameterData, Details } from './types'

export const defaultParameterData: IParameterData = {
  id: 0,
  key: '',
  parent: '',
  parenttype: '',
  title: '',
  type: 'parameter',
  year: '',
  details: [{
    type: '',
    title: '',
    key: '',
    value: ''
  }]
}

export const getParameters = (params: any) =>
  request({
    url: '/parameters',
    method: 'get',
    params
  })

export const getParameter = (id: number, params: any) =>
  request({
    url: `/parameters/${id}`,
    method: 'get',
    params
  })

export const createParameter = (data: any) =>
  request({
    url: '/parameters',
    method: 'post',
    data
  })

export const updateParameter = (id: number, data: any) =>
  request({
    url: `/parameters/${id}`,
    method: 'put',
    data
  })

export const deleteParameter = (id: number) =>
  request({
    url: `/parameters/${id}`,
    method: 'delete'
  })
