import { env } from "@/env.mjs";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
    token: string;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt: async ({ token, account }) => {
      if (account) {
        return {
          ...token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          refresh_token: account.refresh_token,
        };
      } else if (
        typeof token.expires_at === "number" &&
        token.expires_at > Date.now() / 1000
      ) {
        return token;
      } else if (typeof token.refresh_token === "string") {
        try {
          const auth = Buffer.from(
            env.SPOTIFY_CLIENT_ID + ":" + env.SPOTIFY_CLIENT_SECRET
          ).toString("base64");
          const response = await fetch(
            "https://accounts.spotify.com/api/token",
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${auth}`,
              },
              body: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: token.refresh_token,
              }),
              method: "POST",
            }
          );

          const newToken = (await response.json()) as {
            access_token: string;
            expires_in: number;
            refresh_token?: string;
          };

          if (!response.ok) throw newToken;

          return {
            ...token,
            access_token: newToken.access_token,
            expires_at: Math.floor(Date.now() / 1000 + newToken.expires_in),
            refresh_token: newToken.refresh_token ?? token.refresh_token,
          };
        } catch (error) {
          console.error("Error refreshing access token", error);
          return { ...token, error: "RefreshAccessTokenError" as const };
        }
      }
      return token;
    },
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
      },
      token: token.access_token,
    }),
  },
  providers: [
    SpotifyProvider({
      clientId: env.SPOTIFY_CLIENT_ID,
      clientSecret: env.SPOTIFY_CLIENT_SECRET,
      authorization:
        "https://accounts.spotify.com/authorize?scope=user-top-read,user-read-recently-played",
    }),
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
