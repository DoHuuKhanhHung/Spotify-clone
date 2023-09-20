import useSpotify from "@/hooks/useSpotify";
import { IPlaylistContext, PlaylistContextState } from "@/types";
import { Session } from "inspector";
import { useSession } from "next-auth/react";
import PreviousMap from "postcss/lib/previous-map";
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

const defaultPlaylistContextState: PlaylistContextState = {
  playlist: [],
  selectedPlaylistId: null,
  selectedPlaylist: null,
};

export const PlaylistContext = createContext<IPlaylistContext>({
  playlistContextState: defaultPlaylistContextState,
  updatePlaylistContextState: () => {},
});

export const usePlaylistContext = () => useContext(PlaylistContext);

const PlaylistContextProvider = ({ children }: { children: ReactNode }) => {
  const spotifyAPI = useSpotify();
  const { data: session } = useSession();

  const [playlistContextState, setPlaylistContextState] = useState(
    defaultPlaylistContextState
  );

  const updatePlaylistContextState = (
    updatedObj: Partial<PlaylistContextState>
  ) => {
    setPlaylistContextState((previousPlaylistContextState) => ({
      ...previousPlaylistContextState,
      ...updatedObj,
    }));
  };

  useEffect(() => {
    const getUserPlaylists = async () => {
      const userPlaylistResponse = await spotifyAPI.getUserPlaylists();
      updatePlaylistContextState({ playlist: userPlaylistResponse.body.items });
    };

    if (spotifyAPI.getAccessToken()) {
      getUserPlaylists();
    }
  }, [session, spotifyAPI]);

  const playlistContextStateProviderData = {
    playlistContextState,
    updatePlaylistContextState,
  };

  return (
    <PlaylistContext.Provider value={playlistContextStateProviderData}>
      {children}
    </PlaylistContext.Provider>
  );
};

export default PlaylistContextProvider;
