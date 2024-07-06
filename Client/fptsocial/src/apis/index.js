import axios from 'axios'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT, API_ROOT_FAKE_DATA } from '~/utils/constants'

// export const getAllPost = async () => {
//   const response = await authorizedAxiosInstance.get(`${API_ROOT_FAKE_DATA}/products`)
//   return response.data
// }

export const checkUserExist = async () => {
  // console.log(token, 'checkUserExist');
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserProfile/checkuserexist`)
  return response.data
}

export const getUserByNumber = async (userNumber) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserProfile/getuserbynumber`,
    {
      params: {
        UserNumber: userNumber
      }
    }
  )
  return response.data?.data
}

export const getUserByUserId = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserProfile/getuserbyuserid`)
  console.log(response.data?.data);
  return response.data?.data
}

export const getOtherUserByUserId = async ({ userId, viewUserId }) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserProfile/getotheruserbyuserid`,
    {
      params: {
        UserId: userId,
        ViewUserId: viewUserId
      }
    }
  )
  return response.data?.data
}

export const getInterest = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserEntitiesDetail/getinterest`)
  return response.data?.data
}

export const getGender = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserEntitiesDetail/getgender`)
  return response.data?.data
}

export const getStatus = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserEntitiesDetail/getstatus`)
  return response.data?.data
}

export const getRelationships = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/Relationship/getrelationship`)
  return response.data?.data
}

export const getListSettings = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserEntitiesDetail/getsettings`)
  return response.data?.data
}

export const getUserSettings = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserEntitiesDetail/getusersettings`)
  return response.data?.data
}

export const getButtonFriend = async (userId, friendId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserProfile/getbuttonfriend?UserId=${userId}&FriendId=${friendId}`)
  return response.data?.data
}

export const updateFriendStatus = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserRelationship/friendstatus`, data)
  return response.data?.data
}

export const updateSettings = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserRelationship/updatesettings`, data)
  return response.data?.data
}


export const createByLogin = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserProfile/createbylogin`, data)
  return response.data?.data
}

export const updateUserProfile = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserProfile/updateprofile`, data)
  return response.data?.data
}

export const sendFriend = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserRelationship/sendfriend`, data)
  return response.data?.data
}

//user profile
export const getAllFriend = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserProfile/getallfriend`)
  return response.data?.data
}
export const getAllFriendOtherProfile = async (viewUserId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserProfile/getallfriendotherprofile?ViewUserId=${viewUserId}`)
  return response.data?.data
}

// file upload
export const uploadImage = async ({ userId, data }) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UploadFile/uploadImage?userId=${userId}`, data)
  return response.data
}
export const uploadVideo = async ({ userId, data }) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UploadFile/uploadVideo?userId=${userId}`, data)
  return response.data
}

//api post
export const getUserPostByUserId = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserPost/getuserpostbyuserid`)
  return response.data?.data
}

export const getOtherUserPost = async (userId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserPost/getotheruserpost?UserId=${userId}`)
  return response.data?.data
}

export const getAllPost = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserPost/getpost`)
  return response.data?.data
}

export const getComment = async (userPostId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserPost/getComment?UserPostId=${userPostId}`)
  return response.data?.data
}
export const getVideoComment = async (userPostVideoId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserPost/getVideoComment?UserPostVideoId=${userPostVideoId}`)
  return response.data?.data
}
export const getPhotoComment = async (userPostPhotoId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserPost/getPhotoComment?UserPostId=${userPostPhotoId}`)
  return response.data?.data
}

export const createPost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserPost/createPost`, data)
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

//group api
export const getGroupType = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/GroupEntity/getgrouptype`)
  return response.data?.data
}

export const createGroup = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/Group/creategroup`, data)
  return response.data?.data
}

