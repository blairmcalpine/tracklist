import AuthBar, { defaultImage } from "@/components/AuthBar";
import BackButton from "@/components/BackButton";
import Container from "@/components/Container";
import TrackTable from "@/components/TrackTable";
import type { SpotifyArtist } from "@/types/spotify";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useMemo } from "react";

export default function ArtistPage() {
  const { query, isReady, push } = useRouter();
  const { data: sessionData } = useSession();
  const enabled =
    isReady && typeof query.artist === "string" && Boolean(sessionData);
  const {
    data: tracksData,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = api.artist.tracks.useInfiniteQuery(
    { artistId: query.artist as string },
    {
      enabled,
      getNextPageParam: (lastPage) => lastPage.cursor,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );
  const { data: artistData } = api.artist.artist.useQuery(
    query.artist as string,
    {
      enabled,
      refetchOnWindowFocus: false,
    }
  );

  const tracks = useMemo(
    () => tracksData?.pages.flatMap((page) => page.tracks),
    [tracksData]
  );

  if (sessionData === null) {
    void push("/");
    return null;
  }
  return (
    <>
      <Container className="max-h-screen flex-col items-center justify-center gap-5 p-5">
        <ArtistProfile artist={artistData} />
        <TrackTable
          tracks={tracks}
          onScrollEnd={() => {
            if (!isFetchingNextPage && hasNextPage) void fetchNextPage();
          }}
          loadingMore={isFetchingNextPage}
        />
      </Container>
      <BackButton />
      <AuthBar />
    </>
  );
}

function ArtistProfile({ artist }: { artist: SpotifyArtist | undefined }) {
  if (!artist)
    return (
      <div className="flex h-[30vh] min-h-[30vh] w-[60%] gap-5 rounded bg-elevated p-5">
        <div className="relative aspect-square h-full animate-pulse rounded bg-highlighted" />
        <div className="flex w-full flex-col justify-center gap-8">
          <div className="h-20 w-full animate-pulse rounded-full bg-highlighted" />
          <div className="h-[30px] w-[80%] animate-pulse rounded-full bg-highlighted" />
        </div>
      </div>
    );
  const { images, name, followers, popularity } = artist;
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
          <span>
            {followers.total.toLocaleString()} Followers &middot;&nbsp;
          </span>
          <span className="text-green">{popularity}%</span>
          <span>&nbsp;Popularity</span>
        </div>
      </div>
    </div>
  );
}
