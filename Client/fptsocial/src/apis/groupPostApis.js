import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

export const getGroupPostByGroupId = async ({ groupId, page, pageSize = 10, type = 'New' }) => {
  const response = await authorizedAxiosInstance
    .get(`${API_ROOT}/api/GroupPost/getGroupPostByGroupId?GroupId=${groupId}&Page=${page}&PageSize=${pageSize}&Type=${type}`)
  return response.data?.data
}
export const getGroupPostByGroupPostId = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/GroupPost/getGroupPostByGroupPostId?GroupPostId=${id}`)
  return response.data?.data
}
export const getChildGroupPost = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/GroupPost/getChildGroupPost?GroupPostMediaId=${id}`)
  return response.data?.data
}

export const getGroupPostComment = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/GroupPost/getGroupPostComment?GroupPostId=${id}`)
  return response.data?.data
}
export const getGroupSharePostComment = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/GroupPost/getGroupSharePostComment?GroupSharePostId=${id}`)
  return response.data?.data
}
export const getGroupVideoPostComment = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/GroupPost/getGroupVideoPostComment?GroupPostVideoId=${id}`)
  return response.data?.data
}
export const getGroupPhotoPostComment = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/GroupPost/getGroupPhotoPostComment?GroupPostPhotoId=${id}`)
  return response.data?.data
}

export const getAllReactByGroupPostId = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserReact/getAllReactByGroupPostId?GroupPostId=${id}`)
  return response.data?.data
}
export const getAllReactByGroupSharePostId = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserReact/getAllReactByGroupSharePostId?GroupSharePostId=${id}`)
  return response.data?.data
}
export const getAllReactByGroupPhotoPostId = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserReact/getAllReactByGroupPhotoPostId?GroupPostPhotoId=${id}`)
  return response.data?.data
}
export const getAllReactByGroupVideoPostId = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserReact/getAllReactByGroupVideoPostId?GroupPostVideoId=${id}`)
  return response.data?.data
}

export const getAllReactByGroupCommentId = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserReact/getAllReactByGroupCommentId?CommentGroupPostId=${id}`)
  return response.data?.data
}
export const getAllReactByCommentGroupSharePostId = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserReact/getAllReactByCommentGroupSharePostId?CommentGroupSharePostId=${id}`)
  return response.data?.data
}
export const getAllReactByGroupCommentVideoId = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserReact/getAllReactByGroupCommentVideoId?CommentGroupVideoPostId=${id}`)
  return response.data?.data
}
export const getAllReactByGroupCommentPhotoId = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserReact/getAllReactByGroupCommentPhotoId?CommentPhotoGroupPostId=${id}`)
  return response.data?.data
}


export const createGroupPost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/GroupPost/createGroupPost`, data)
  return response.data?.data
}
export const commentGroupPost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/GroupPost/commentGroupPost`, data)
  return response.data?.data
}
export const commentGroupSharePost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/GroupPost/commentGroupSharePost`, data)
  return response.data?.data
}
export const commentGroupVideoPost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/GroupPost/commentGroupVideoPost`, data)
  return response.data?.data
}
export const commentGroupPhotoPost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/GroupPost/commentGroupPhotoPost`, data)
  return response.data?.data
}

export const createReactGroupPost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserReact/createReactGroupPost`, data)
  return response.data?.data
}
export const createReactGroupSharePost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserReact/createReactGroupSharePost`, data)
  return response.data?.data
}
export const createReactGroupPhotoPost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserReact/createReactGroupPhotoPost`, data)
  return response.data?.data
}
export const createReactGroupVideoPost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserReact/createReactGroupVideoPost`, data)
  return response.data?.data
}

export const createReactCommentGroupPost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserReact/createReactCommentGroupPost`, data)
  return response.data?.data
}
export const createReactCommentGroupSharePost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserReact/createReactCommentGroupSharePost`, data)
  return response.data?.data
}
export const createReactCommentGroupVideoPost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserReact/createReactCommentGroupVideoPost`, data)
  return response.data?.data
}
export const createReactCommentGroupPhotoPost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserReact/createReactCommentGroupPhotoPost`, data)
  return response.data?.data
}
export const shareGroupPost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/GroupPost/shareGroupPost`, data)
  return response.data?.data
}

export const updateGroupPost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/GroupPost/updateGroupPost`, data)
  return response.data?.data
}
export const updateGroupSharePost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/GroupPost/updateGroupSharePost`, data)
  return response.data?.data
}
export const updateGroupPhotoPost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/GroupPost/updateGroupPhotoPost`, data)
  return response.data?.data
}
export const updateGroupVideoPost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/GroupPost/updateGroupVideoPost`, data)
  return response.data?.data
}
export const updateGroupCommentPost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/GroupPost/updateGroupCommentPost`, data)
  return response.data?.data
}
export const updateGroupCommentVideoPost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/GroupPost/updateGroupCommentVideoPost`, data)
  return response.data?.data
}
export const updateGroupCommentPhotoPost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/GroupPost/updateGroupCommentPhotoPost`, data)
  return response.data?.data
}
export const updateCommentGroupSharePost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/GroupPost/updateCommentGroupSharePost`, data)
  return response.data?.data
}


export const deleteGroupPost = async (id) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/api/GroupPost/deleteGroupPost?GroupPostId=${id}`)
  return response.data?.data
}
export const deleteGroupSharePost = async (id) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/api/GroupPost/deleteGroupSharePost?GroupSharePostId=${id}`)
  return response.data?.data
}

export const deleteCommentGroupPost = async (id) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/api/GroupPost/deleteCommentGroupPost?CommentGroupPostId=${id}`)
  return response.data?.data
}
export const deleteCommentGroupSharePost = async (id) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/api/GroupPost/deleteCommentGroupSharePost?CommentGroupSharePostId=${id}`)
  return response.data?.data
}
export const deleteCommentGroupPhotoPost = async (id) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/api/GroupPost/deleteCommentGroupPhotoPost?CommentPhotoGroupPostId=${id}`)
  return response.data?.data
}
export const deleteCommentGroupVideoPost = async (id) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/api/GroupPost/deleteCommentGroupVideoPost?CommentGroupVideoPostId=${id}`)
  return response.data?.data
}


export const approveGroupPost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/GroupPost/approveGroupPost`, data)
  return response.data?.data
}

