import request from '@/utils/request'
import { IBudgetData } from './types'

export const defaultBudgetData: IBudgetData = {
  id: 0,
  name: '',
  status: ''
}

export const getBudgets = (params: any) =>
  request({
    url: '/budgets',
    method: 'get',
    params
  })

export const getBudget = (id: number, params: any) =>
  request({
    url: `/budgets/${id}`,
    method: 'get',
    params
  })

export const createBudget = (data: any) =>
  request({
    url: '/budgets',
    method: 'post',
    data
  })

export const updateBudget = (id: number, data: any) =>
  request({
    url: `/budgets/${id}`,
    method: 'put',
    data
  })

export const deleteBudget = (id: number) =>
  request({
    url: `/Budgets/${id}`,
    method: 'delete'
  })

export const getPageviews = (params: any) =>
  request({
    url: '/pageviews',
    method: 'get',
    params
  })
