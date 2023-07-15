import ArtistTable from "@/components/ArtistTable";
import AuthBar, { defaultImage } from "@/components/AuthBar";
import BackButton from "@/components/BackButton";
import Container from "@/components/Container";
import TrackTable from "@/components/TrackTable";
import { api } from "@/utils/api";
import type { Session } from "next-auth";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";

export default function ProfilePage() {
  const { data: sessionData } = useSession();
  const { push } = useRouter();
  const { data: artists } = api.spotify.getTopArtists.useQuery(undefined, {
    enabled: Boolean(sessionData),
  });
  const { data: tracks } = api.spotify.getTopTracks.useQuery(undefined, {
    enabled: Boolean(sessionData),
  });

  if (sessionData === null) {
    void push("/");
    return null;
  }

  return (
    <>
      <BackButton />
      <AuthBar />
      <Container className="max-h-screen flex-col items-center gap-5 p-5">
        <Profile sessionData={sessionData} />
        <div className="flex gap-5 overflow-hidden">
          <div className="flex w-full flex-col gap-3">
            <h2 className="ml-5 text-2xl font-bold">Your Top Artists</h2>
            <ArtistTable artists={artists} />
          </div>
          <div className="flex w-full flex-col gap-3">
            <h2 className="ml-5 text-2xl font-bold">Your Top Tracks</h2>
            <TrackTable tracks={tracks} />
          </div>
        </div>
      </Container>
    </>
  );
}

function Profile({ sessionData }: { sessionData: Session | null }) {
  return (
    <div className="flex flex-col gap-1 rounded bg-elevated p-5">
      {sessionData?.user ? (
        <>
          <Image
            src={sessionData.user.image ?? defaultImage}
            alt={sessionData.user.name ?? sessionData.user.id}
            width={192}
            height={192}
            className="h-48 w-48 rounded-full object-cover"
            priority
          />
          <p className="mt-3 text-2xl font-bold">
            {sessionData.user.name ?? "Spotify User"}
          </p>
          <p className="text-xl font-thin text-gray">{sessionData.user.id}</p>
        </>
      ) : (
        <>
          <div className="h-48 w-48 animate-pulse rounded-full bg-highlighted" />
          <div className="mb-1 mt-4 h-6 w-48 animate-pulse rounded-full bg-highlighted" />
          <div className="my-1 h-5 w-36 animate-pulse rounded-full bg-highlighted" />
        </>
      )}
    </div>
  );
}