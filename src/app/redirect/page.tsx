'use client';
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Stack } from "@mui/system";
import { Button } from "@mui/material";

interface UserData {
  username?: string;
  email?: string;
  exp?: number;
  [key: string]: any;
}

export default function Redirect() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [forceRedirect, setForceRedirect] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // Extract tokens from URL fragment
    const hash = window.location.hash.substring(1); // Remove the '#'
    const params = new URLSearchParams(hash);
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');

    if (accessToken && refreshToken) {
      // Set cookies
      setCookie('accessToken', accessToken, {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });

      setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });

      // Clean up the URL by removing the fragment
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    // Verify authentication and redirect if needed
    if (!accessToken) {
      router.push('/login');
    } else {
      setForceRedirect(true);
      router.push("/dashboard")
    }
  }, [router]);



  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-sm font-bold mb-6">Google Redirect...</h2>
      {
        (forceRedirect) && 
        <Stack direction={"row"} alignItems={"center"} padding={"5px"} columnGap={"1rem"}>
          <p>Click this Button manually if not redirect...</p>
          <Button variant="contained" color="primary" onClick={() => router.push("/dashboard")}>DashBoard Page</Button>
        </Stack>
      }
    </div>
  );
}