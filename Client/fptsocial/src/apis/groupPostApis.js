import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

export const getGroupPostByGroupId = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/GroupPost/getGroupPostByGroupId?GroupPostId=${id}`)
  return response.data?.data
}

export const createGroupPost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/GroupPost/createGroupPost`, data)
  return response.data?.data
}