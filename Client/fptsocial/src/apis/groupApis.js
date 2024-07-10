import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

export const getGroupType = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/GroupEntity/getgrouptype`)
  return response.data?.data
}

export const getGroupStatusForCreate = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/GroupEntity/getgroupstatusforcreate`)
  return response.data?.data
}

export const getGroupStatus = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/GroupEntity/getgroupstatus`)
  return response.data?.data
}
export const getGroupByGroupId = async (groupId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/Group/getgroupbygroupid?GroupId=${groupId}`)
  return response.data?.data
}


export const createGroup = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/Group/creategroup`, data)
  return response.data?.data
}

