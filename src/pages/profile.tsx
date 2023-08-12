import ArtistTable from "@/components/ArtistTable";
import AuthBar, { defaultImage } from "@/components/AuthBar";
import BackButton from "@/components/BackButton";
import Container from "@/components/Container";
import Player from "@/components/Player";
import SearchButton from "@/components/SearchButton";
import TrackTable from "@/components/TrackTable";
import { api } from "@/utils/api";
import type { Session } from "next-auth";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";

export default function ProfilePage() {
  const { data: sessionData } = useSession();
  const { push } = useRouter();
  const { data } = api.user.topItems.useQuery(undefined, {
    enabled: Boolean(sessionData),
  });

  if (sessionData === null) {
    void push("/");
  }

  return (
    <>
      <BackButton />
      <SearchButton />
      <AuthBar />
      <Container className="max-h-[100dvh] flex-col items-center gap-5 p-3 pt-20 md:p-5 md:pt-5">
        <Profile sessionData={sessionData} />
        <div className="flex w-full flex-col gap-5 overflow-y-hidden md:flex-row">
          <div className="flex w-full flex-col gap-3 overflow-y-hidden">
            <h2 className="ml-5 text-2xl font-bold">Your Top Artists</h2>
            <ArtistTable artists={data?.artists} />
          </div>
          <div className="flex w-full flex-col gap-3 overflow-y-hidden">
            <h2 className="ml-5 text-2xl font-bold">Your Top Tracks</h2>
            <TrackTable tracks={data?.tracks} />
          </div>
        </div>
        <Player />
      </Container>
    </>
  );
}

function Profile({ sessionData }: { sessionData: Session | null }) {
  return (
    <div className="hidden flex-col gap-1 rounded bg-elevated p-5 md:flex">
      {sessionData?.user ? (
        <>
          <Image
            src={sessionData.user.image ?? defaultImage}
            alt={sessionData.user.name ?? sessionData.user.id}
            width={192}
            height={192}
            className="h-48 w-48 rounded object-cover"
            priority
          />
          <p className="mt-3 text-2xl font-bold">
            {sessionData.user.name ?? "Spotify User"}
          </p>
          <p className="text-xl font-thin text-gray">{sessionData.user.id}</p>
        </>
      ) : (
        <>
          <div className="h-48 w-48 animate-pulse rounded bg-highlighted" />
          <div className="mb-1 mt-4 h-6 w-48 animate-pulse rounded-full bg-highlighted" />
          <div className="my-1 h-5 w-36 animate-pulse rounded-full bg-highlighted" />
        </>
      )}
    </div>
  );
}
