import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

// project imports
import axios from 'utils/axios';

declare module 'next-auth' {
  interface User {
    accessToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
  providers: [
    // Credentials provider for login
    CredentialsProvider({
      id: 'login',
      name: 'login',
      credentials: {
        email: { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter Email' },
        password: { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter Password' }
      },
      async authorize(credentials) {
        try {
          // Backend API call to your login endpoint
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            email: credentials?.email,
            password: credentials?.password
          });

          const { accessToken, user } = response.data;

          if (accessToken) {
            // Attach the accessToken to the user object
            user.accessToken = accessToken;
            return user; // Return user data including accessToken
          }

          throw new Error('Authentication failed'); // Throw an error if no accessToken

        } catch (e: any) {
          const errorMessage = e?.message || e?.response?.data?.message || 'Something went wrong!';
          throw new Error(errorMessage); // Throw an error if the API call fails
        }
      }
    }),

    // Optional: Google provider for OAuth login
    GoogleProvider({
      clientId: process.env.NEXT_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.NEXT_GOOGLE_CLIENT_SECRET!
    })
  ],
  callbacks: {
    // Handling JWT callback to store the access token in the JWT
    jwt: async ({ token, user, account }) => {
      if (user) {
        token.accessToken = user.accessToken; // Attach the accessToken to the JWT token
        token.id = user.id;
        token.provider = account?.provider;
      }
      return token; // Return the updated token
    },
    // Handling session callback to make sure the session contains the JWT token
    session: ({ session, token }) => {
      if (token) {
        session.id = token.id;
        session.provider = token.provider;
        session.token = token; // Attach the JWT token to the session
      }
      return session; // Return the session with the token
    }
  },
  session: {
    strategy: 'jwt', // Use JWT strategy for session
    maxAge: Number(process.env.NEXT_PUBLIC_JWT_TIMEOUT!) // Set session timeout
  },
  jwt: {
    secret: process.env.NEXT_PUBLIC_JWT_SECRET, // Secret key for JWT
  },
  pages: {
    signIn: '/login', // Custom signIn page
    newUser: '/register' // Custom registration page
  }
};
