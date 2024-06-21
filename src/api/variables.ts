import request from '@/utils/request'
import { IVariableData, Details } from './types'

export const defaultVariableData: IVariableData = {
  id: 0,
  key: '',
  parent: '',
  parenttype: '',
  title: '',
  type: 'variable',
  details: [{
    type: '',
    title: '',
    key: '',
    value: '',
    anyRezerv: false,
    includeSgk: false,
    isToWorkRate: false,
    variableGroup: ''
  }]
}

export const getVariables = (params: any) =>
  request({
    url: '/variables',
    method: 'get',
    params
  })

export const getVariable = (id: number, params: any) =>
  request({
    url: `/variables/${id}`,
    method: 'get',
    params
  })

export const createVariable = (data: any) =>
  request({
    url: '/variables',
    method: 'post',
    data
  })

export const updateVariable = (id: number, data: any) =>
  request({
    url: `/variables/${id}`,
    method: 'put',
    data
  })

export const deleteVariable = (id: number) =>
  request({
    url: `/variables/${id}`,
    method: 'delete'
  })
