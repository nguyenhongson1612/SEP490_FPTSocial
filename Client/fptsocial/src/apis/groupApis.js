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

export const getGroupByUserId = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/Group/getgroupbyuserid`)
  return response.data?.data
}

export const getRequestJoin = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/Group/getrequestjoin?GroupId=${id}`)
  return response.data?.data
}

export const createGroup = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/Group/creategroup`, data)
  return response.data?.data
}

export const invitesFriend = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/Group/InvatedFriend`, data)
  return response.data?.data
}
export const memberJoinStatus = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/Group/memberjoinstatus`, data)
  return response.data?.data
}

export const requestJoinGroup = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/Group/requestjoingroup`, data)
  return response.data?.data
}

export const cancelRequestJoin = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/Group/cancelrequesttojoin`, data)
  return response.data?.data
}

