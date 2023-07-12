import ArtistTable from "@/components/ArtistTable";
import { defaultImage } from "@/components/AuthBar";
import { api } from "@/utils/api";
import type { Session } from "next-auth";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";

export default function ProfilePage() {
  const { data: sessionData } = useSession();
  const { push } = useRouter();
  const { data: artists } = api.spotify.getTopArtists.useQuery(undefined, {
    enabled: Boolean(sessionData?.user),
  });

  if (sessionData?.user === null) return push("/");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 p-5">
      <Profile sessionData={sessionData} />
      <div className="flex w-full gap-5">
        <div className="flex w-full flex-col gap-3">
          <h2 className="ml-5 text-2xl font-bold">Your Top Artists</h2>
          <ArtistTable artists={artists} />
        </div>
        <ArtistTable artists={undefined} />
      </div>
    </main>
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
