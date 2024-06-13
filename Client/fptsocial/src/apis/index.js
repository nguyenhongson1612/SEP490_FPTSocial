import axios from 'axios'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

export const getAllPost = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/products`)
  return response.data
}

export const checkUserExist = async () => {
  // console.log(token, 'checkUserExist');
  const response = await authorizedAxiosInstance.get('https://localhost:44329/api/UserProfile/checkuserexist')
  return response.data
}

export const createByLogin = async (data) => {
  const response = await authorizedAxiosInstance.post('https://localhost:44329/api/UserProfile/createbylogin', data)
  console.log(response)
  return response.data?.data
}

export const getUserByNumber = async (userNumber) => {
  const response = await authorizedAxiosInstance.get('https://localhost:44329/api/UserProfile/getuserbynumber',
    {
      params: {
        UserNumber: userNumber
      }
    }
  )
  // console.log(response)
  return response.data?.data
}

export const getGender = async () => {
  const response = await authorizedAxiosInstance.get('https://localhost:44329/api/UserEntitiesDetail/getgender')
  return response.data
}