// src/utils/decoded.token.data.ts
import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from "./auth.keys";
import Cookies from 'js-cookie'; // Client-side alternative

interface DecodedToken {
  user_id?: string;
  organization_id?: string;
  name?: string;
  email?: string;
  phone?: string;
  category?: string;
  provider?: string;
  [key: string]: any;
}

// Client-side cookie access
export const getAccessTokenFromCookie = (): { accessToken: string | null } => {
  if (typeof window === 'undefined') {
    // Server-side - use different approach
    return { accessToken: null };
  }
  const accessToken = Cookies.get('accessToken') || null;
  return { accessToken };
};

// Server-side helper (for getServerSideProps)
export const getAccessTokenFromRequest = (req: any): { accessToken: string | null } => {
  const accessToken = req.cookies.accessToken || null;
  return { accessToken };
};

export const decodeToken = (token?: string): DecodedToken | null => {
  const accessToken = token || getAccessTokenFromCookie().accessToken;
  
  if (!accessToken) {
    return null;
  }

  try {
    const decoded = jwt.verify(accessToken, JWT_SECRET_KEY) as DecodedToken;
    
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

// Helper functions (client-side)
export const organization_id = () => decodeToken()?.organization_id;
export const user_id = () => decodeToken()?.user_id;