export interface IPInfo {
    ipAddress: string;
    ipVersion?: number;
    latitude?: number;
    longitude?: number;
    countryName?: string;
    countryCode?: string;
    timeZone?: string;
    zipCode?: string;
    cityName?: string;
    regionName?: string;
    isProxy?: boolean;
    continent?: string;
    continentCode?: string;
    currency?: {
        code: string;
        name: string;
    };
    language?: string;
    timeZones?: string[];
    tlds?: string[];
}

export interface IPResponse {
    success: boolean;
    data?: IPInfo;
    error?: string;
}
