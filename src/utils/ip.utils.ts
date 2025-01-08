import { NextRequest } from 'next/server';
import axios from 'axios';
import { IPInfo, IPResponse } from '@/lib/types/ip.types';

/**
 * Get client IP address from Next.js request
 */
export const getClientIP = (req: NextRequest): string => {
    // First try X-Forwarded-For header
    const forwardedFor = req.headers.get('x-forwarded-for');
    if (forwardedFor) {
        // Get the first IP if multiple are present
        const ips = forwardedFor.split(',').map(ip => ip.trim());
        // Filter out private IPs
        const publicIP = ips.find(ip => !isPrivateIP(ip));
        if (publicIP) return publicIP;
    }

    // Try X-Real-IP header
    const realIP = req.headers.get('x-real-ip');
    if (realIP && !isPrivateIP(realIP)) {
        return realIP;
    }

    // If we get here, we need to get the public IP
    return '0.0.0.0'; // This will trigger public IP lookup
};

/**
 * Check if an IP is private
 */
const isPrivateIP = (ip: string): boolean => {
    // Remove IPv6 prefix if present
    if (ip.includes('::ffff:')) {
        ip = ip.split('::ffff:')[1];
    }
    
    // Check for localhost and private IP ranges
    return ip === '127.0.0.1' ||
           ip === 'localhost' ||
           ip.startsWith('10.') ||
           ip.startsWith('192.168.') ||
           /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(ip) ||
           ip.startsWith('::1') ||
           ip === '0.0.0.0';
};

/**
 * Get public IP address using multiple services
 */
export const getPublicIP = async (): Promise<string> => {
    const services = [
        'https://api.ipify.org?format=json',
        'https://api.ip.sb/ip',
        'https://api.myip.com'
    ];

    for (const service of services) {
        try {
            const response = await axios.get(service);
            if (typeof response.data === 'string') {
                return response.data.trim();
            } else if (response.data.ip) {
                return response.data.ip;
            }
        } catch (error) {
            console.error(`Error fetching from ${service}:`, error);
            continue; // Try next service
        }
    }
    throw new Error('Failed to get public IP from all services');
};

/**
 * Get detailed IP information
 */
export const getIPInfo = async (ipAddress: string): Promise<IPResponse> => {
    try {
        // If IP is private or invalid, get public IP
        if (isPrivateIP(ipAddress)) {
            ipAddress = await getPublicIP();
        }

        // Fetch IP information using the public IP
        const response = await axios.get(`https://freeipapi.com/api/json/${ipAddress}`);
        
        // Validate the response
        if (response.data.countryName === '-' || !response.data.countryName) {
            // If freeipapi fails, try ipapi.co as fallback
            const fallbackResponse = await axios.get(`https://ipapi.co/${ipAddress}/json/`);
            return {
                success: true,
                data: {
                    ipAddress,
                    cityName: fallbackResponse.data.city || 'Unknown',
                    countryName: fallbackResponse.data.country_name || 'Unknown',
                    countryCode: fallbackResponse.data.country_code || 'XX',
                    regionName: fallbackResponse.data.region || 'Unknown',
                    latitude: fallbackResponse.data.latitude || 0,
                    longitude: fallbackResponse.data.longitude || 0
                }
            };
        }

        return {
            success: true,
            data: {
                ipAddress,
                ...response.data
            }
        };
    } catch (error) {
        console.error('Error fetching IP info:', error);
        return {
            success: false,
            error: 'Failed to fetch IP information',
            data: {
                ipAddress,
                cityName: 'Unknown',
                countryName: 'Unknown',
                countryCode: 'XX',
                regionName: 'Unknown',
                latitude: 0,
                longitude: 0
            }
        };
    }
};
