import { usePlaylistContext } from "@/contexts/PlaylistContext";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import UserIcon from "../assets/User.webp";
import { ChevronDoubleDownIcon } from "@heroicons/react/outline";
// import "tailwindcss/tailwind.css";
import { useEffect, useState } from "react";
import { pickRandom } from "@/utils/pickRandom";
import Songs from "./Songs";

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-purple-500",
  "from-pink-500",
];

const Center = () => {
  const Divider = () => (
    <hr className="border-t-[0.1px] border-[#6a6a6a] m-7" />
  );
  const {
    playlistContextState: { selectedPlaylist, selectedPlaylistId },
  } = usePlaylistContext();
  const { data: session } = useSession();
  const [fromColors, setFromColors] = useState<string | null>(null);
  useEffect(() => {
    setFromColors(pickRandom(colors));
  }, [selectedPlaylistId]);
  return (
    <div className=" flex-grow text-white font-semibold relative h-screen overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-8 ">
        <div
          className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full py-1 pl-1 pr-2 h-12"
          onClick={() => {
            signOut();
          }}>
          <Image
            src={session?.user?.image || UserIcon}
            alt="User Avatar"
            height={40}
            width={40}
            className="rounded-full object-cover h-10"
          />
          <h2>{session?.user?.name}</h2>
          <ChevronDoubleDownIcon className="icon" />
        </div>
      </header>

      <section
        className={` flex items-end space-x-7 bg-gradient-to-b ${fromColors} to-[#181818] h-96 p-8`}>
        {selectedPlaylist && (
          <>
            <Image
              src={selectedPlaylist.images[0].url}
              alt="Playlist Image"
              height={176}
              width={176}
              objectFit="contain"
              className="shadow-2xl rounded-lg h-44 object-cover"
            />
            <div>
              <p>PLAYLIST</p>
              <h1 className="text-2xl font-bold md:text-3xl xl:text-5xl">
                {selectedPlaylist.name}
              </h1>
            </div>
          </>
        )}
      </section>
      <Divider />
      <div>
        <Songs />
      </div>
    </div>
  );
};

export default Center;
