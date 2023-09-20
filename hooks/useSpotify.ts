import { spotifyAPI } from "@/config/spotify";
import { ExtendedSession, ExtendedToken, TokenError } from "@/types";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

const useSpotify = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) return;

    // Nếu refresh token fail, chuyển sang Login
    if (
      (session as unknown as ExtendedSession).error ===
      TokenError.RefreshAccessTokenError
    ) {
      signIn();
    }

    spotifyAPI.setAccessToken(
      (session as unknown as ExtendedSession).accessToken
    );
  }, [session]);

  return spotifyAPI;
};
export default useSpotify;
