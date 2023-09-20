import Center from "@/components/Center";
import Player from "@/components/Player";
import Sidebar from "@/components/Sidebar";
import PlaylistContextProvider from "@/contexts/PlaylistContext";
import SongContextProvider from "@/contexts/SongContext";
import Head from "next/head";

export default function Home() {
  return (
    <div className="bg-[#181818] h-full scrollbar-hide">
      <PlaylistContextProvider>
        <SongContextProvider>
          <Head>
            <title>Spotify</title>
            <link rel="icon" href="/icon.ico" sizes="any" />
          </Head>
          <main className="flex scrollbar-hidden">
            <Sidebar />
            <Center />
          </main>
          <div className="sticky bottom-0 text-white ">
            <Player />
          </div>
        </SongContextProvider>
      </PlaylistContextProvider>
    </div>
  );
}
