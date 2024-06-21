// Set utils function parseTime to filter
export { parseTime } from '@/utils'

// Filter for article status
export const articleStatusFilter = (status: string) => {
  const statusMap: { [key: string]: string } = {
    published: 'success',
    draft: 'info',
    deleted: 'danger'
  }
  return statusMap[status]
}

// Filter for employee status
export const employeeStatusFilter = (status: string) => {
  const statusMap: { [key: string]: string } = {
    active: 'success',
    passive: 'info',
    deleted: 'danger'
  }
  return statusMap[status]
}

// Filter for company status
export const companyStatusFilter = (status: string) => {
  const statusMap: { [key: string]: string } = {
    active: 'success',
    passive: 'info',
    deleted: 'danger'
  }
  return statusMap[status]
}

// Filter for employee status
export const userStatusFilter = (status: string) => {
  const statusMap: { [key: string]: string } = {
    active: 'success',
    passive: 'info',
    deleted: 'danger'
  }
  return statusMap[status]
}

// Filter to uppercase the first character
export const uppercaseFirstChar = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
