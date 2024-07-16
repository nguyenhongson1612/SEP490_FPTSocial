import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

//user react
export const getAllReactType = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserReact/getAllReactType`)
  return response.data?.data
}

export const getAllReactByPostId = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserReact/getAllReactByPostId?UserPostId=${id}`)
  return response.data?.data
}
export const getAllReactBySharePostId = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserReact/getAllReactBySharePostId?SharePostId=${id}`)
  return response.data?.data
}
export const getAllReactByPhotoPostId = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserReact/getAllReactByPhotoPostId?UserPostPhotoId=${id}`)
  return response.data?.data
}
export const getAllReactByVideoPostId = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserReact/getAllReactByVideoPostId?UserPostVideoId=${id}`)
  return response.data?.data
}

export const getAllReactByCommentId = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserReact/getAllReactByCommentId?CommentId=${id}`)
  return response.data?.data
}
export const getAllReactByCommentSharePostId = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserReact/getAllReactByCommentSharePostId?CommentSharePostId=${id}`)
  return response.data?.data
}
export const getAllReactByCommentVideoId = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserReact/getAllReactByCommentVideoId?CommentVideoPostId=${id}`)
  return response.data?.data
}
export const getAllReactByCommentPhotoId = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserReact/getAllReactByCommentPhotoId?CommentPhotoPostId=${id}`)
  return response.data?.data
}


export const createReactPost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserReact/createReactPost`, data)
  return response.data?.data
}
export const createReactSharePost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserReact/createReactSharePost`, data)
  return response.data?.data
}

export const createReactPhotoPost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserReact/createReactPhotoPost`, data)
  return response.data?.data
}

export const createReactVideoPost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserReact/createReactVideoPost`, data)
  return response.data?.data
}

export const createReactCommentUserPost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserReact/createReactCommentUserPost`, data)
  return response.data?.data
}
export const createReactCommentSharePost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserReact/createReactCommentSharePost`, data)
  return response.data?.data
}
export const createReactCommentUserPhotoPost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserReact/createReactCommentUserPhotoPost`, data)
  return response.data?.data
}
export const createReactCommentUserVideoPost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserReact/createReactCommentUserVideoPost`, data)
  return response.data?.data
}
