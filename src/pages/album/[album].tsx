import AuthBar, { defaultImage } from "@/components/AuthBar";
import BackButton from "@/components/BackButton";
import Container from "@/components/Container";
import SearchButton from "@/components/SearchButton";
import TrackTable from "@/components/TrackTable";
import type { SpotifyAlbum } from "@/types/spotify";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
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
      <Container className="max-h-[100dvh] flex-col items-center justify-center gap-5 p-5">
        <AlbumDisplay album={albumData?.album} />
        <TrackTable tracks={albumData?.tracks} />
      </Container>
    </>
  );
}

function AlbumDisplay({ album }: { album: SpotifyAlbum | undefined }) {
  if (!album)
    return (
      <div className="flex h-[30vh] min-h-[30vh] w-[60%] gap-5 rounded bg-elevated p-5">
        <div className="relative aspect-square h-full animate-pulse rounded bg-highlighted" />
        <div className="flex w-full flex-col justify-center gap-8">
          <div className="h-20 w-full animate-pulse rounded-full bg-highlighted" />
          <div className="h-[30px] w-[80%] animate-pulse rounded-full bg-highlighted" />
          <div className="h-[30px] w-[20%] animate-pulse rounded-full bg-highlighted" />
          <div className="w-[5 0%]	h-4 animate-pulse rounded-full bg-highlighted" />
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
    <div className="flex h-[30vh] min-h-[30vh] min-w-[50%] max-w-[90%] gap-5 rounded bg-elevated p-5">
      <div className="relative aspect-square h-full">
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
          {artists.map((artist, idx) => (
            <Fragment key={idx}>
              <Link
                className="hover:text-white hover:underline"
                href={`/artist/${artist.id}`}
              >
                {artist.name}
              </Link>
              <span> ·&nbsp;</span>
            </Fragment>
          ))}
          <span>{release_date.split("-")[0]} ·&nbsp;</span>
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
