import { JWT_SECRET_KEY } from "./auth.keys";
import jwt from 'jsonwebtoken';

interface DecodedToken {
  user_id?: string;
  organization_id?: string;
  name?: string;
  email?: string;
  phone?: string;
  category?: string;
  provider?: string;
  [key: string]: any; // Allow for other claims
}

export const getAccessTokenFromCookie = (): { accessToken: string | null } => {
  const cookieMatch = "document.cookie.match(/(^|;\s*)accessToken=([^;]*)/);"
  return {
    accessToken: cookieMatch ? cookieMatch[2] : null
  };
};



export const decodeToken = (): DecodedToken | null => {
  const { accessToken } = getAccessTokenFromCookie();
  
  if (!accessToken) {
    return null;
  }

  try {
    const decoded = jwt.decode(accessToken) as DecodedToken;

    console.log("dec", decoded);
    
    
    // Extract only the properties we want to expose
    const { user_id, organization_id, name, email, phone, category, provider } = decoded;

    return {
      user_id,
      organization_id,
      name,
      email,
      phone,
      category,
      provider
    };
  } catch (error) {
    console.error("Failed to decode/verify token:", error);
    return null;
  }
};

// Get the decoded token once and reuse it
const decodedToken = decodeToken();

// console.log("organization_id", decodedToken?.organization_id);


export const organization_id = decodedToken?.organization_id;
export const user_id = decodedToken?.user_id;

