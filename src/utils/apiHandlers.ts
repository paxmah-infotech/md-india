import axiosInstance from './axiosInstance'
import { getRandomComplexSuffix } from './suffixapi'

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_BASE_URL = '/api'

const handleApiError = (error: any) => {
  try {
    if (error?.response && error?.response?.data) {
      throw new Error(error?.response?.data?.message || 'An error occurred')
    } else {
      throw new Error('An error occurred')
    }
  } catch (error: any) {
    console.log('error 32452')
  }
}

// pre

// Function to generate a complex random path for the API endpoint
const generateRandomAPIEndpoint = () => {
  const randomString = getRandomComplexSuffix(11) // Random string part (e.g., "Mbk85")
  const randomUppercaseString = getRandomComplexSuffix(5).toUpperCase() // Random uppercase (e.g., "EM")
  const randomNumber = Math.floor(Math.random() * 100) // Random number (0-99)

  // Construct the API endpoint path with combined dynamic parts (e.g., "Mbk85EM33")
  return `${API_BASE_URL}/user/auth/${randomString}${randomUppercaseString}${randomNumber}`
}

export const auth_t = async () => {
  try {
    const randomEndpoint = generateRandomAPIEndpoint() // Generate complex random endpoint
    const response = await axiosInstance.post(randomEndpoint)
    return response?.data
  } catch (error: any) {
    handleApiError(error)
  }
}

export const createQr = async (formData: any) => {
  try {
    const response = await axiosInstance.post(
      `${API_BASE_URL}/v1/qr/generate`,
      formData
    )
    return response?.data
  } catch (error: any) {
    handleApiError(error)
  }
}

export const deleteQr = async (qrId: string) => {
  // console.log('qrId : ', qrId)
  try {
    // Sending qrId as a query parameter
    const response = await axiosInstance.delete(
      `${API_BASE_URL}/v1/qr/delete`,
      {
        params: { qrId } // Correctly passing qrId as a query parameter
      }
    )
    return response?.data
  } catch (error: any) {
    handleApiError(error)
  }
}

export const fetchDashboard = async () => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/v1/dashboard`)
    return response?.data
  } catch (error: any) {
    handleApiError(error)
  }
}

export const getUserHistory = async (page: number, limit: number) => {
  try {
    const response = await axiosInstance.get(
      `${API_BASE_URL}/auth/user/data/history?page=${page}&limit=${limit}`
    )
    return response?.data
  } catch (error: any) {
    handleApiError(error)
  }
}

// delete history 
 export const deleteHistory = async (id:string) =>{
  try {
    const response = await axiosInstance.delete(
      `${API_BASE_URL}/auth/user/data/history/delete?id=${id}`
    )
    return response?.data
  } catch (error:any) {
    handleApiError(error)
  }
 }

export const fetchUserQrCodes = async (page: number, limit: number) => {
  try {
    const response = await axiosInstance.get(
      `${API_BASE_URL}/v1/qr/getuserqr?page=${page}&limit=${limit}`
    )
    return response?.data
  } catch (error: any) {
    handleApiError(error)
  }
}

// senstive

export const deleteAccount = async () => {
  try {
    const response = await axiosInstance.delete(
      `${API_BASE_URL}/auth/user/deleteaccount`
    ) // Your API endpoint for deleting the user account
    return response?.data
  } catch (error) {
    console.error('Error deleting account:', error)
    throw error
  }
}

export const updateUser = async (
  name: string,
  email?: string
) => {
  try {
    const response = await axiosInstance.patch(
      `${API_BASE_URL}/auth/user/update`,
      {
        name,
      }
    ) // Your API endpoint
    return response?.data
  } catch (error) {
    console.error('Error updating user details:', error)
    throw error
  }
}
