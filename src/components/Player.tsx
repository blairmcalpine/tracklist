import usePlayer from "@/hooks/usePlayer";
import Pause from "@/icons/Pause";
import Play from "@/icons/Play";
import Speaker from "@/icons/Speaker";
import type { SpotifyTrack } from "@/types/spotify";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import ArtistListText from "./ArtistListText";
import { defaultImage } from "./AuthBar";

export default function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const playbackRef = useRef<HTMLInputElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const volumeProgressRef = useRef<HTMLDivElement>(null);
  const { togglePlayback, track, isPlaying } = usePlayer();
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const dragging = useRef(false);

  const moveSlider = useCallback(
    (value: number) => {
      if (playbackRef.current && progressRef.current) {
        setProgress(value);
        const percentage = (value / duration) * 100;
        progressRef.current.style.transform = `translateX(-${
          100 - percentage
        }%)`;
      }
    },
    [duration]
  );
  const onMouseUp = useCallback(() => {
    dragging.current = false;
    if (!playbackRef.current || !audioRef.current) return;
    audioRef.current.currentTime = progress;
  }, [progress]);
  const onProgressChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      moveSlider(e.target.valueAsNumber);
    },
    [moveSlider]
  );
  const onTimeUpdate = useCallback(() => {
    if (!dragging.current && audioRef.current && audioRef.current.duration) {
      if (duration === 0) setDuration(audioRef.current.duration);
      moveSlider(audioRef.current.currentTime);
    }
  }, [moveSlider, duration]);
  const onVolumeChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setVolume(e.target.valueAsNumber);
    if (!volumeProgressRef.current) return;
    volumeProgressRef.current.style.transform = `translateX(-${
      100 - e.target.valueAsNumber * 100
    }%)`;
  }, []);

  useEffect(() => {
    moveSlider(0);
    if (!audioRef.current) return;
    if (progressRef.current)
      if (!track) audioRef.current.src = "";
      else {
        audioRef.current.src = track.preview_url;
        void audioRef.current.play();
      }
  }, [track, moveSlider]);
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
      <div className="flex w-full items-center">
        <TrackInfo track={track} />
        <div className="flex basis-1/2 flex-col items-center gap-3">
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
          <div className="flex w-full items-center gap-3">
            <span className="text-xs font-thin text-gray">
              {formattedProgress}
            </span>
            <div className="relative flex w-full items-center">
              <div className="absolute left-1 top-0 h-1 w-[calc(100%-0.5rem)] overflow-hidden rounded-lg bg-[#555555]">
                <div
                  className="h-full w-full -translate-x-full bg-green"
                  ref={progressRef}
                />
              </div>
              <input
                type="range"
                ref={playbackRef}
                disabled={!track}
                className="z-10 h-1 w-full bg-transparent"
                step={0.1}
                onMouseUp={onMouseUp}
                onMouseDown={() => (dragging.current = true)}
                onChange={onProgressChange}
                value={progress}
                min={0}
                max={duration}
              />
            </div>
            <span className="text-xs font-thin text-gray">
              {formattedDuration}
            </span>
          </div>
        </div>
        <div className="flex basis-1/4 items-center justify-end gap-1">
          <Speaker className="h-4 w-4 fill-gray" />
          <div className="relative flex items-center">
            <div className="absolute left-1 top-0 h-1 w-[calc(100%-0.5rem)] overflow-hidden rounded-lg bg-[#555555]">
              <div
                className="h-full w-full -translate-x-1/2 bg-green"
                ref={volumeProgressRef}
              />
            </div>
            <input
              type="range"
              className="z-10 h-1 bg-transparent"
              step={0.05}
              onChange={onVolumeChange}
              min={0}
              max={1}
              value={volume}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function TrackInfo({ track }: { track: SpotifyTrack | null }) {
  if (!track) {
    return (
      <div className="flex basis-1/4 items-center gap-3.5">
        <div className="h-14 w-14 rounded bg-highlighted" />
        <div className="flex w-full flex-col gap-2">
          <div className="h-3.5 w-1/2 rounded-full bg-highlighted" />
          <div className="h-3 w-1/3 rounded-full bg-highlighted" />
        </div>
      </div>
    );
  }
  return (
    <div className="flex basis-1/4 items-center gap-3.5">
      <Image
        className="h-14 w-14 rounded object-cover"
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
