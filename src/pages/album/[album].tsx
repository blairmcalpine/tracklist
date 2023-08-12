import ArtistListText from "@/components/ArtistListText";
import AuthBar, { defaultImage } from "@/components/AuthBar";
import BackButton from "@/components/BackButton";
import Container from "@/components/Container";
import Player from "@/components/Player";
import SearchButton from "@/components/SearchButton";
import TrackTable from "@/components/TrackTable";
import type { SpotifyAlbum } from "@/types/spotify";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Fragment } from "react";

export default function AlbumPage() {
  const { query, isReady, push } = useRouter();
  const { data: sessionData } = useSession();
  const enabled =
    isReady && typeof query.album === "string" && Boolean(sessionData);
  const { data: albumData } = api.album.album.useQuery(query.album as string, {
    enabled,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  if (sessionData === null) {
    void push("/");
  }
  return (
    <>
      <BackButton />
      <SearchButton />
      <AuthBar />
      <Container className="max-h-[100dvh] flex-col items-center justify-center gap-5 p-3 pt-20 md:p-5 md:pt-5">
        <AlbumDisplay album={albumData?.album} />
        <TrackTable tracks={albumData?.tracks} />
        <Player />
      </Container>
    </>
  );
}

function AlbumDisplay({ album }: { album: SpotifyAlbum | undefined }) {
  if (!album)
    return (
      <div className="flex w-full gap-5 rounded bg-elevated p-5 md:h-[30vh] md:min-h-[30vh] md:w-[60%]">
        <div className="relative hidden aspect-square h-full animate-pulse rounded bg-highlighted md:block" />
        <div className="flex w-full flex-col justify-center gap-4">
          <div className="h-24 w-full animate-pulse rounded-full bg-highlighted" />
          <div className="h-[36px] w-[80%] animate-pulse rounded-full bg-highlighted" />
          <div className="h-[36px] w-[20%] animate-pulse rounded-full bg-highlighted" />
          <div className="h-6	w-[50%] animate-pulse rounded-full bg-highlighted" />
        </div>
      </div>
    );
  const {
    images,
    name,
    popularity,
    total_tracks,
    release_date,
    label,
    artists,
  } = album;
  return (
    <div className="flex w-full gap-5 rounded bg-elevated p-5 md:h-[30vh] md:min-h-[30vh] md:w-fit md:min-w-[50%] md:max-w-[90%]">
      <div className="relative hidden aspect-square h-full md:block">
        <Image
          className="object-cover"
          src={images[0]?.url ?? defaultImage}
          alt={name}
          priority
          fill
          sizes="30vw"
        />
      </div>
      <div className="flex flex-col justify-center gap-4 truncate">
        <h1 className="truncate text-8xl font-extrabold">{name}</h1>
        <div className="text-3xl text-gray">
          <ArtistListText artists={artists} separator=" · " />
          <span> · {release_date.split("-")[0]} ·&nbsp;</span>
          <span>{total_tracks} Tracks</span>
        </div>
        <div className="text-3xl text-gray">
          <span className="text-green">{popularity}%</span>
          <span>&nbsp; Popularity</span>
        </div>
        <span className="text-gray">{label}</span>
      </div>
    </div>
  );
}
