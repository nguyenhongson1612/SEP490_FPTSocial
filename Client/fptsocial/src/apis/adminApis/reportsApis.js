import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

export const getListReportUser = async ({ page = 1, pageSize = 10 }) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/Report/getListReportUser?Page=${page}&PageSize=${pageSize}`)
  return response.data?.data
}
export const getListReportPost = async ({ page = 1, pageSize = 10 }) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/Report/getListReportPost?Page=${page}&PageSize=${pageSize}`)
  return response.data?.data
}
export const getListReportGroup = async ({ page = 1, pageSize = 10 }) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/Report/getListReportGroup?Page=${page}&PageSize=${pageSize}`)
  return response.data?.data
}
export const getListReportComment = async ({ page = 1, pageSize = 10 }) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/Report/getListReportComment?Page=${page}&PageSize=${pageSize}`)
  return response.data?.data
}