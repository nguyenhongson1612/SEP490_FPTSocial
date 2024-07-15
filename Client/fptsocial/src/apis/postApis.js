import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

export const getChildPostById = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserPost/getChildPostById?UserPostMediaId=${id}`)
  return response.data?.data
}

export const getPhotoComment = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserPost/getPhotoComment?UserPostPhotoId=${id}`)
  return response.data?.data
}
export const getVideoComment = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserPost/getVideoComment?UserPostVideoId=${id}`)
  return response.data?.data
}

export const getUserPostByUserId = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserPost/getuserpostbyuserid`)
  return response.data?.data
}

export const getOtherUserPost = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserPost/getotheruserpost?OtherUserId=${id}`)
  return response.data?.data
}

export const getAllPost = async (page, pageSize) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserPost/getpost?Page=${page}&PageSize=${pageSize}`)
  return response.data?.data
}

export const getComment = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserPost/getComment?UserPostId=${id}`)
  return response.data?.data
}

export const getUserPostById = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserPost/getuserpostbyid?UserPostId=${id}`)
  return response.data?.data
}

//post
export const createPost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserPost/createPost`, data)
  return response.data?.data
}

export const updateUserPost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserPost/updateUserPost`, data)
  return response.data?.data
}

export const commentPost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserPost/commentPost`, data)
  return response.data?.data
}
export const commentVideoPost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserPost/commentVideoPost`, data)
  return response.data?.data
}
export const commentPhotoPost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserPost/commentPhotoPost`, data)
  return response.data?.data
}

