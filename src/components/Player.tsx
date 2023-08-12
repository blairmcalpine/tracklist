import usePlayer from "@/hooks/usePlayer";
import Pause from "@/icons/Pause";
import Play from "@/icons/Play";
import Speaker from "@/icons/Speaker";
import type { SpotifyTrack } from "@/types/spotify";
import * as Slider from "@radix-ui/react-slider";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ArtistListText from "./ArtistListText";
import { defaultImage } from "./AuthBar";

export default function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { togglePlayback, track, isPlaying } = usePlayer();
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const dragging = useRef(false);

  const onTimeUpdate = useCallback(() => {
    if (!dragging.current && audioRef.current && audioRef.current.duration) {
      if (duration === 0) setDuration(audioRef.current.duration);
      setProgress(audioRef.current.currentTime);
    }
  }, [duration]);
  const onProgressChange = useCallback(
    (value: number[]) => {
      setProgress(value[0] ?? 0);
      if (audioRef.current) audioRef.current.currentTime = value[0] ?? 0;
    },
    [audioRef]
  );
  useEffect(() => {
    if (!audioRef.current) return;
    if (!track) audioRef.current.src = "";
    else {
      audioRef.current.src = track.preview_url;
      void audioRef.current.play();
    }
  }, [track]);
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying && audioRef.current?.paused) {
      void audioRef.current.play();
    } else if (!isPlaying && !audioRef.current?.paused) {
      void audioRef.current.pause();
    }
  }, [isPlaying]);
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  const formattedProgress = useMemo(() => {
    const progressMinutes = Math.floor(progress / 60);
    const progressSeconds = Math.floor(progress % 60);
    return `${progressMinutes}:${progressSeconds.toString().padStart(2, "0")}`;
  }, [progress]);
  const formattedDuration = useMemo(() => {
    const durationMinutes = Math.floor(duration / 60);
    const durationSeconds = Math.floor(duration % 60);
    return `${durationMinutes}:${durationSeconds.toString().padStart(2, "0")}`;
  }, [duration]);

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={onTimeUpdate}
        onEnded={() => togglePlayback()}
      />
      <div className="flex w-full flex-col items-center gap-2 md:gap-0">
        <div className="flex w-full items-center">
          <TrackInfo track={track} />
          <div className="flex basis-1/5 justify-center">
            <button
              className={`grid h-8 w-8 place-items-center rounded-full bg-white transition-opacity ${
                track ? "opacity-100" : "opacity-50"
              }`}
              onClick={() => togglePlayback()}
              disabled={!track}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </button>
          </div>
          <div className="flex max-w-[40%] basis-2/5 items-center justify-end gap-2">
            <Speaker className="h-4 w-4 fill-gray" />
            <Slider.Root
              className="group relative flex h-2 w-full max-w-[8rem] touch-none select-none items-center"
              value={[volume]}
              max={1}
              min={0}
              step={0.05}
              onValueChange={(value: number[]) => setVolume(value[0] ?? 0.5)}
            >
              <Slider.Track className="relative h-1 grow rounded-full bg-[#555555]">
                <Slider.Range className="absolute h-full rounded-full bg-white group-hover:bg-green" />
              </Slider.Track>
              <Slider.Thumb
                className="hidden h-3 w-3 rounded-full bg-white group-hover:block"
                aria-label="Volume"
              />
            </Slider.Root>
          </div>
        </div>
        <div className="flex w-full items-center gap-3 md:w-1/2">
          <span className="text-xs font-thin text-gray">
            {formattedProgress}
          </span>
          <Slider.Root
            className="group relative flex h-2 w-full touch-none select-none items-center"
            value={[progress]}
            max={duration}
            min={0}
            step={0.1}
            onValueChange={onProgressChange}
            disabled={!track}
          >
            <Slider.Track className="relative h-1 grow rounded-full bg-[#555555]">
              <Slider.Range className="absolute h-full rounded-full bg-white group-hover:bg-green" />
            </Slider.Track>
            <Slider.Thumb
              className="hidden h-3 w-3 rounded-full bg-white group-hover:block"
              aria-label="Progress"
            />
          </Slider.Root>
          <span className="text-xs font-thin text-gray">
            {formattedDuration}
          </span>
        </div>
      </div>
    </>
  );
}

function TrackInfo({ track }: { track: SpotifyTrack | null }) {
  if (!track) {
    return (
      <div className="flex basis-2/5 items-center gap-3.5">
        <div className="hidden h-14 w-14 rounded bg-highlighted md:block" />
        <div className="flex w-full flex-col gap-2">
          <div className="h-3.5 w-1/2 rounded-full bg-highlighted" />
          <div className="h-3 w-1/3 rounded-full bg-highlighted" />
        </div>
      </div>
    );
  }
  return (
    <div className="flex max-w-[40%] basis-2/5 items-center gap-3.5 truncate">
      <Image
        className="hidden h-14 w-14 rounded object-cover md:block"
        src={track.album.images[0]?.url ?? defaultImage}
        alt={track.album?.name}
        width={track.album.images[0]?.width ?? 56}
        height={track.album.images[0]?.height ?? 56}
      />
      <div className="flex flex-col">
        <span className="text-sm font-thin">{track.name}</span>
        <div className="truncate text-xs font-thin text-gray">
          <ArtistListText artists={track.artists} />
        </div>
      </div>
    </div>
  );
}
