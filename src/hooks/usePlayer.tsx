import { createContext, useContext, useEffect, useRef, useState } from "react";

type PlayerContext = {
  changeSource: (src: string | null) => void;
};

const PlayerContext = createContext<PlayerContext>({
  changeSource: () => {
    void 0;
  },
});

export function PlayerContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const playerRef = useRef<HTMLAudioElement | null>(null);
  function changeSource(src: string | null) {
    if (!playerRef.current) return;
    if (src === null) return void playerRef.current.pause();
    playerRef.current.src = src;
  }
  return (
    <>
      <audio ref={playerRef} autoPlay />
      <PlayerContext.Provider
        value={{
          changeSource,
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
