export const GetClientTimezone = (): string => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  };
  
  export const GetClientIp = async (): Promise<string | null> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Error fetching IP:', error);
      return null;
    }
  };
  
  export const GetClientInfo = async (): Promise<{
    timezone: string;
    ip: string | null;
  }> => {
    const timezone = GetClientTimezone();
    const ip = await GetClientIp();
    return { timezone, ip };
  };