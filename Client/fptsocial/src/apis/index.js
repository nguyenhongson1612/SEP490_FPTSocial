import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

export const getAllPost = async () => {
  const response = await axios.get(`${API_ROOT}/products`)
  return response.data
}