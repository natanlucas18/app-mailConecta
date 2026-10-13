import { login } from '@/src/services/login-service';
import { refreshAccessToken } from '@/src/services/refresh-token';
import { BackendLoginResponse } from '@/src/types/backend-login-response';
import { PathLinks } from '@/src/types/path-links';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: PathLinks.LOGIN
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {},
        password: {}
      },

      async authorize(credentials) {
        if (!credentials) return null;

        try {
          const { data, success } = await login({
            email: credentials.email,
            password: credentials.password
          }) as BackendLoginResponse;

          if (!success) return null;

          return {
            id: data.id,
            name: data.name,
            email: data.email,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            expiresIn: data.expiresIn
          };
        } catch {
          return null;
        }
      }
    })

  ],
  callbacks: {
    async jwt({ user, token }) {
      if (user) {
        const expiresInSeconds = Number(user.expiresIn ?? 0);
        return {
          ...token,
          sub: user.id,
          name: user.name,
          email: user.email,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpiresAt: Date.now() + (expiresInSeconds * 1000)
        };
      }

      const shouldRefresh = Date.now() >= (token.accessTokenExpiresAt - 10000);

      if (!shouldRefresh) return token;

      return refreshAccessToken(token);
    },


    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.accessToken = token.accessToken as string
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
