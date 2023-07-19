import type { SpotifyTrack } from "@/types/spotify";
import React, { createContext, useContext, useState } from "react";

type PlayerContext = {
  togglePlayback: (track?: SpotifyTrack) => void;
  isPlaying: boolean;
  track: SpotifyTrack | null;
};

const PlayerContext = createContext<PlayerContext>({} as PlayerContext);

export function PlayerContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [track, setTrack] = useState<SpotifyTrack | null>(null);
  function togglePlayback(newTrack?: SpotifyTrack) {
    if (newTrack) {
      if (newTrack.id === track?.id) setIsPlaying(!isPlaying);
      else {
        setTrack(newTrack);
        setIsPlaying(true);
      }
    } else if (track) setIsPlaying(!isPlaying);
  }
  return (
    <>
      <PlayerContext.Provider
        value={{
          togglePlayback,
          isPlaying,
          track,
        }}
      >
        {children}
      </PlayerContext.Provider>
    </>
  );
}

export default function usePlayer() {
  return useContext(PlayerContext);
}
