"use client";

export { SessionProvider } from "next-auth/react";

import {
  HomeIcon,
  HeartIcon,
  CollectionIcon,
  PlusCircleIcon,
  RssIcon,
  SearchIcon,
} from "@heroicons/react/outline";
import IconButton from "./iconButton";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import { usePlaylistContext } from "@/contexts/PlaylistContext";
import useSpotify from "@/hooks/useSpotify";

const Divider = () => <hr className="border-t-[1px] border-[#6a6a6a]" />;

const Sidebar = () => {
  const spotifyAPI = useSpotify();
  const {
    playlistContextState: { playlist },
    updatePlaylistContextState,
  } = usePlaylistContext();

  const setSelectedPlaylist = async (playlistId: string) => {
    const playlistResponse = await spotifyAPI.getPlaylist(playlistId);
    updatePlaylistContextState({
      selectedPlaylistId: playlistId,
      selectedPlaylist: playlistResponse.body,
    });
  };

  return (
    <div className="text-[#a7a7a7] px-5 pt-5 pb-36 text-xs lg:text-sm border-r border-gray-900 h-screen over-y-flow sm:max-w-[12rem] lg:max-w-[15rem] hidden md:block font-semibold rounded-full scrollbar-hide">
      <div className="space-y-4">
        <IconButton icon={HomeIcon} label="Trang Chủ" />
        <IconButton icon={SearchIcon} label="Tìm Kiếm" />
        <IconButton icon={CollectionIcon} label="Thư Viện" />
        <Divider />
        <IconButton icon={PlusCircleIcon} label="Thêm Playlist" />
        <IconButton icon={HeartIcon} label="Yêu Thích" />
        {/* <IconButton icon={RssIcon} label="Trang chủ" /> */}
        <Divider />

        {playlist.map(({ id, name }) => (
          <p
            key={id}
            className="cursor-pointer hover:text-white scrollbar-hide"
            onClick={() => {
              setSelectedPlaylist(id);
            }}>
            {name}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
