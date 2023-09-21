import SpotifyProvider from "next-auth/providers/spotify";
import NextAuth from "next-auth/next";
import { scope, spotifyAPI } from "@/config/spotify";
import { CallbacksOptions } from "next-auth";
import { ExtendedToken, TokenError } from "@/types";

const refreshAccessToken = async (
  token: ExtendedToken
): Promise<ExtendedToken> => {
  try {
    spotifyAPI.setAccessToken(token.accessToken);
    spotifyAPI.setRefreshToken(token.refreshToken);

    const { body: refreshedToken } = await spotifyAPI.refreshAccessToken();
    console.log("REFRESHED TOKEN ARE: ", refreshedToken);

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      refreshToken: refreshedToken.refresh_token || token.refreshToken,
      accessTokenExpiresAt: Date.now() + refreshedToken.expires_in * 1000,
    };
  } catch (error) {
    console.error(error);

    return {
      ...token,
      error: TokenError.RefreshAccessTokenError,
    };
  }
};

const jwtCallback: CallbacksOptions["jwt"] = async ({
  token,
  account,
  user,
}) => {
  let extendedToken: ExtendedToken;
  // người dùng đăng nhập lần đầu
  if (account && user) {
    extendedToken = {
      ...token,
      user,
      accessToken: account.access_token as string,
      refreshToken: account.refresh_token as string,
      accessTokenExpiresAt: (account.expires_at as number) * 1000,
    };

    console.log("FIRST TIME LOGIN, EXTENDED TOKEN: ", extendedToken);
    return extendedToken;
  }

  // Các yêu cầu tiếp theo để check auth session
  if (Date.now() + 5000 < (token as ExtendedToken).accessTokenExpiresAt) {
    console.log("ACCESS TOKEN IS VALID, RETURN EXTENDED TOKEN: ", token);
    return token;
  }

  // Access token hết hạn, refresh token
  console.log("ACCESS TOKEN EXPIRED, REFRESHING...");
  return await refreshAccessToken(token as ExtendedToken);
};

const sessionCallback: CallbacksOptions["session"] = async ({
  session,
  token,
}) => {
  session.accessToken = (token as ExtendedToken).accessToken;
  session.error = (token as ExtendedToken).error;

  return session;
};

export default NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
      authorization: {
        url: "https://accounts.spotify.com/authorize",
        params: {
          scope: scope,
        },
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt: jwtCallback,
    session: sessionCallback,
  },
});
