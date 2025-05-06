import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

// Extend next-auth types
declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
      name: string;
      email: string;
      provider: string;
      category: string;
    };
    accessToken: string;
    refreshToken: string;
  }

  interface User {
    id: number;
    name: string;
    email: string;
    provider: string;
    category: string;
    accessToken: string;
    refreshToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: number;
    name: string;
    email: string;
    provider: string;
    category: string;
    accessToken: string;
    refreshToken: string;
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      id: 'login',
      name: 'Login',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'Enter Email' },
        password: { label: 'Password', type: 'password', placeholder: 'Enter Password' }
      },
      async authorize(credentials) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password
            })
          });

          const result = await response.json();

          if (!response.ok || !result?.data?.accessToken) {
            throw new Error(result?.message || 'Invalid login credentials');
          }

          const user = result.data;

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            provider: user.provider,
            category: user.category,
            accessToken: user.accessToken,
            refreshToken: user.refreshToken
          };
        } catch (error: any) {
          throw new Error(error?.message || 'Login failed');
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.NEXT_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.NEXT_GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      }
    })
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = Number(user.id); // 🔧 fix
        token.name = user.name;
        token.email = user.email;
        token.provider = user.provider || account?.provider || 'google';
        token.category = user.category;
        token.accessToken = user.accessToken || account?.access_token || '';
        token.refreshToken = user.refreshToken || account?.refresh_token || '';
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          id: Number(token.id), // 👈 fix here
          name: token.name,
          email: token.email,
          provider: token.provider,
          category: token.category
        };
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
      }
      return session;
    },
    async redirect({ baseUrl, url }) {
      if (url === '/dashboard') {
        // You'll need to retrieve the accessToken somehow
        // We can't access the token here directly, so you can handle it client-side
        return `${baseUrl}/dashboard`;
      }
      return baseUrl;

    }
  },
  session: {
    strategy: 'jwt',
    maxAge: Number(process.env.NEXT_PUBLIC_JWT_TIMEOUT) || 3600
  },

  jwt: {
    secret: process.env.NEXT_PUBLIC_JWT_SECRET
  },

  pages: {
    signIn: '/login',
    error: '/auth/error' // ✅ add this line
  }
};
