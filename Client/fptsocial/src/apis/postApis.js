import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

export const getChildPostById = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserPost/getChildPostById?UserPostMediaId=${id}`)
  return response.data?.data
}

export const getUserPostByUserId = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserPost/getuserpostbyuserid`)
  return response.data?.data
}

export const getOtherUserPost = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserPost/getotheruserpostbyuserid?OtherUserId=${id}`)
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
export const getSharePostComment = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserPost/getCommentBySharePostId?SharePostId=${id}`)
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
export const updateSharePost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserPost/updateSharePost`, data)
  return response.data?.data
}
export const updatePhotoPost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserPost/updatePhotoPost`, data)
  return response.data?.data
}
export const updateVideoPost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserPost/updateVideoPost`, data)
  return response.data?.data
}
export const updateUserCommentPost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserPost/updateUserCommentPost`, data)
  return response.data?.data
}
export const updateCommentSharePost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserPost/updateCommentSharePost`, data)
  return response.data?.data
}
export const updateUserCommentPhotoPost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserPost/updateUserCommentPhotoPost`, data)
  return response.data?.data
}
export const updateUserCommentVideoPost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserPost/updateUserCommentVideoPost`, data)
  return response.data?.data
}

export const commentPost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserPost/commentPost`, data)
  return response.data?.data
}
export const commentSharePost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserPost/createCommentSharePost`, data)
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
export const sharePost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserPost/sharePost`, data)
  return response.data?.data
}

export const deleteUserPost = async (id) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/api/UserPost/deleteUserPost?UserPostId=${id}`)
  return response.data?.data
}
export const deleteSharePost = async (id) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/api/UserPost/deleteSharePost?SharePostId=${id}`)
  return response.data?.data
}

export const deleteCommentUserPost = async (id) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/api/UserPost/deleteCommentUserPost?CommentId=${id}`)
  return response.data?.data
}
export const deleteCommentSharePost = async (id) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/api/UserPost/deleteCommentSharePost?CommentSharePostId=${id}`)
  return response.data?.data
}
export const deleteCommentUserPhotoPost = async (id) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/api/UserPost/deleteCommentUserPhotoPost?CommentPhotoPostId=${id}`)
  return response.data?.data
}
export const deleteCommentUserVideoPost = async (id) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/api/UserPost/deleteCommentUserVideoPost?CommentVideoPostId=${id}`)
  return response.data?.data
}

