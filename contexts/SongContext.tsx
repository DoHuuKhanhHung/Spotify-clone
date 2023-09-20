import { songReducer } from "@/Reducers/songReducer";
import useSpotify from "@/hooks/useSpotify";
import { ISongContext, SongContextState, SongReducerActionType } from "@/types";
import { useSession } from "next-auth/react";
import {
  createContext,
  useContext,
  ReactNode,
  useReducer,
  useEffect,
} from "react";

const defaultSongContextState: SongContextState = {
  selectedSongId: undefined,
  selectedSong: null,
  isPlaying: false,
  volumn: 50,
  deviceId: null,
};

export const SongContext = createContext<ISongContext>({
  songContextState: defaultSongContextState,
  dispatchSongAction: () => {},
});

export const useSongContext = () => useContext(SongContext);

const SongContextProvider = ({ children }: { children: ReactNode }) => {
  const spotifyAPI = useSpotify();
  const { data: session } = useSession();

  const [songContextState, dispatchSongAction] = useReducer(
    songReducer,
    defaultSongContextState
  );

  useEffect(() => {
    const setCurrentDevice = async () => {
      const availableDeviceResponse = await spotifyAPI.getMyDevices();
      if (!availableDeviceResponse.body.devices.length) return;
      const { id: deviceId, volume_percent } =
        availableDeviceResponse.body.devices[0];
      dispatchSongAction({
        type: SongReducerActionType.SetDevice,
        payload: {
          deviceId,
          volumn: volume_percent as number,
        },
      });
      await spotifyAPI.transferMyPlayback([deviceId as string]);
    };
    if (spotifyAPI.getAccessToken()) {
      setCurrentDevice();
    }
  }, [spotifyAPI, session]);

  useEffect(() => {
    const getCurrentPlayingSong = async () => {
      const songInfo = await spotifyAPI.getMyCurrentPlayingTrack();
      if (!songInfo.body) return;
      dispatchSongAction({
        type: SongReducerActionType.SetCurrentPlayingSong,
        payload: {
          selectedSongId: songInfo.body.item?.id,
          selectedSong: songInfo.body.item as SpotifyApi.TrackObjectFull,
          isPlaying: songInfo.body.is_playing,
        },
      });
    };
    if (spotifyAPI.getAccessToken()) {
      getCurrentPlayingSong();
    }
  }, [spotifyAPI, session]);
  const songContextProviderData = {
    songContextState,
    dispatchSongAction,
  };

  return (
    <SongContext.Provider value={songContextProviderData}>
      {children}
    </SongContext.Provider>
  );
};
export default SongContextProvider;
