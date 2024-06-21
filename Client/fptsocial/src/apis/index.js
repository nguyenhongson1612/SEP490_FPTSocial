import axios from 'axios'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT, API_ROOT_FAKE_DATA } from '~/utils/constants'

export const getAllPost = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT_FAKE_DATA}/products`)
  return response.data
}

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

export const getUserByUserId = async (userId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserProfile/getuserbyuserid`,
    { params: { UserId: userId } }
  )
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

export const createByLogin = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserProfile/createbylogin`, data)
  return response.data?.data
}

export const updateUserProfile = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserProfile/updateprofile`, data)
  return response.data?.data
}