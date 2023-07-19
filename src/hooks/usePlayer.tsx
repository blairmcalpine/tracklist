import type { SpotifyTrack } from "@/types/spotify";
import React, { createContext, useCallback, useContext, useState } from "react";

type PlayerContext = {
  togglePlayback: (track?: SpotifyTrack | null) => void;
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
  const togglePlayback = useCallback(
    (newTrack?: SpotifyTrack | null) => {
      if (newTrack) {
        if (newTrack.id === track?.id) setIsPlaying(!isPlaying);
        else {
          setTrack(newTrack);
          setIsPlaying(true);
        }
      } else if (newTrack === null) {
        setTrack(null);
        setIsPlaying(false);
      } else if (track) setIsPlaying(!isPlaying);
    },
    [track, isPlaying]
  );
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
