import { usePlaylistContext } from "@/contexts/PlaylistContext";
import { useSongContext } from "@/contexts/SongContext";
import useSpotify from "@/hooks/useSpotify";
import { SongReducerActionType } from "@/types";
import { convertDuration } from "@/utils/durationConverter";
import Image from "next/image";

interface Props {
  item: SpotifyApi.PlaylistTrackObject;
  itemIndex: number;
}

const Song = ({ item: { track }, itemIndex }: Props) => {
  const spotifyAPI = useSpotify();
  const {
    songContextState: { deviceId },
    dispatchSongAction,
  } = useSongContext();

  const {
    playlistContextState: { selectedPlaylist },
  } = usePlaylistContext();
  const playSong = async () => {
    if (!deviceId) return;
    dispatchSongAction({
      type: SongReducerActionType.SetCurrentPlayingSong,
      payload: {
        selectedSongId: track?.id,
        selectedSong: track,
        isPlaying: true,
      },
    });
    await spotifyAPI.play({
      device_id: deviceId,
      context_uri: selectedPlaylist?.uri,
      offset: {
        uri: track?.uri as string,
      },
    });
  };
  return (
    <div
      className="grid grid-cols-2 text-[#6a6a6a] font-semibold px-5 py-4 hover:bg-[hsla(0,0%,100%,.1)] hover:text-white rounded-lg cursor-pointer "
      onClick={playSong}>
      <div className="flex items-center space-x-4">
        <p>{itemIndex + 1}</p>
        <div>
          <Image
            src={track?.album.images[0].url || ""}
            alt="Track Cover"
            height={40}
            width={40}
            className="rounded-sm"
          />
        </div>
        <div>
          <p className="w-36 lg:w-72 truncate text-white">{track?.name}</p>
          <p className="w-40">{track?.artists[0].name}</p>
        </div>
      </div>
      <div className="flex justify-between items-center ml-auto lg:ml-0 ">
        <p className="hidden md:block w-40">{track?.album.name}</p>
        <p>{convertDuration(track?.duration_ms as number)}</p>
      </div>
    </div>
  );
};

export default Song;
