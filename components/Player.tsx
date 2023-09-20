import { spotifyAPI } from "@/config/spotify";
import { useSongContext } from "@/contexts/SongContext";
import useSpotify from "@/hooks/useSpotify";
import { SongReducerActionType } from "@/types";
import Image from "next/image";
import {
  ArrowsRightLeftIcon,
  ForwardIcon,
  PauseIcon,
  BackwardIcon,
  PlayIcon,
  ArrowUturnLeftIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/solid";
import { ChangeEventHandler, Fragment } from "react";
import { useDebouncedCallback } from "use-debounce";

const Player = () => {
  const spotifyAPI = useSpotify();
  const {
    songContextState: { isPlaying, selectedSong, deviceId, volumn },
    dispatchSongAction,
  } = useSongContext();
  const handlePlayPause = async () => {
    const respone = await spotifyAPI.getMyCurrentPlaybackState();
    if (!respone.body) return;
    if (respone.body.is_playing) {
      await spotifyAPI.pause();
      dispatchSongAction({
        type: SongReducerActionType.ToggleIsPlaying,
        payload: false,
      });
    } else {
      await spotifyAPI.play();
      dispatchSongAction({
        type: SongReducerActionType.ToggleIsPlaying,
        payload: true,
      });
    }
  };

  const handleSkipSong = async (skipTo: "previous" | "next") => {
    if (!deviceId) return;
    if (skipTo === "previous") await spotifyAPI.skipToPrevious();
    else await spotifyAPI.skipToNext();

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

  const debounceAdjustVolumn = useDebouncedCallback((volumn: number) => {
    spotifyAPI.setVolume(volumn);
  }, 500);

  const handleVolumnChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const volumn = Number(event.target.value);

    if (!deviceId) return;
    debounceAdjustVolumn(volumn);
    dispatchSongAction({
      type: SongReducerActionType.SetVolumn,
      payload: volumn,
    });
  };
  return (
    <div className="h-24 bg-gradient-to-b bg-black grid grid-cols-3 text-xs md:text-base px-2 md:px-8 font-semibold">
      <div className="flex items-center space-x-4">
        {selectedSong && (
          <>
            <div className="hidden md:block">
              <Image
                src={selectedSong.album.images[0].url}
                alt={`Album cover for ${selectedSong.name}`}
                height={75}
                width={75}
                className="rounded-sm"
              />
            </div>
            <div>
              <h3>{selectedSong.name}</h3>
              <p className="text-[#6a6a6a]">{selectedSong.artists[0].name}</p>
            </div>
          </>
        )}
      </div>
      <div className="flex justify-evenly items-center">
        <ArrowsRightLeftIcon className="icon-playback" />
        <BackwardIcon
          className="icon-playback"
          onClick={handleSkipSong.bind(this, "previous")}
        />
        {isPlaying ? (
          <PauseIcon className="icon-playback" onClick={handlePlayPause} />
        ) : (
          <PlayIcon className="icon-playback" onClick={handlePlayPause} />
        )}
        <ForwardIcon
          className="icon-playback"
          onClick={handleSkipSong.bind(this, "next")}
        />
        <ArrowUturnLeftIcon className="icon-playback" />
      </div>
      <div className="flex justify-end items-center pr-5 space-x-3 md:space-x-4">
        <SpeakerWaveIcon className="icon-playback" />
        <input
          type="range"
          min={0}
          max={100}
          className="w-25 md:auto"
          value={volumn}
          onChange={handleVolumnChange}
        />
      </div>
    </div>
  );
};

export default Player;
