import axios from 'axios'

interface IPInfoResponse {
  success: boolean
  data?: {
    ip?: string
    city?: string
    region?: string
    country?: string
    loc?: string
    org?: string
    postal?: string
    timezone?: string
  }
  error?: string
}

export const getIPInfo = async (ip: string): Promise<IPInfoResponse> => {
  try {
    // Use ipinfo.io API for IP geolocation
    const response = await axios.get(`https://ipinfo.io/${ip}/json`, {
      headers: {
        'Authorization': `Bearer ${process.env.IPINFO_TOKEN}`
      }
    })

    return {
      success: true,
      data: response.data
    }
  } catch (error) {
    console.error('Error fetching IP info:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
