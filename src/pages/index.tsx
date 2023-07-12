import { api } from "@/utils/api";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

const defaultImage =
  "https://i.scdn.co/image/ab6761610000517458efbed422ab46484466822b";

export default function Home() {
  const { data: sessionData } = useSession();
  const signedIn = Boolean(sessionData?.user);
  const { data, isLoading, isError } = api.spotify.getTopArtists.useQuery(
    undefined,
    {
      enabled: signedIn,
    }
  );

  if (!signedIn) {
    return <SignIn />;
  }
  if (isLoading) {
    return <TableSkeleton />;
  }
  if (isError) {
    return <div>Error</div>;
  }

  const sortedArtists = data.sort((a, b) => b.popularity - a.popularity);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <table>
        <thead>
          <tr>
            <th className="border-b-[1px] pr-3 text-right font-thin text-gray">
              #
            </th>
            <th className="border-b-[1px] text-gray"></th>
            <th className="border-b-[1px] pl-3 text-left font-thin text-gray">
              Artist
            </th>
            <th className="border-b-[1px] text-left font-thin text-gray">
              Popularity
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedArtists.map(
            ({ id, name, images, popularity, genres }, idx) => (
              <tr key={id}>
                <td className="pr-3 text-right font-thin text-gray">
                  {idx + 1}
                </td>
                <td>
                  <Image
                    className="h-14 w-14 rounded-full object-cover"
                    src={images[0]?.url ?? defaultImage}
                    alt={name}
                    width={56}
                    height={56}
                  />
                </td>
                <td>
                  <div className="flex flex-col p-3">
                    <p>{name}</p>
                    <p className="text-ellipsis text-sm font-thin capitalize text-gray">
                      {genres[0]}
                    </p>
                  </div>
                </td>
                <td className="text-center">{popularity}</td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </main>
  );
}

function SignIn() {
  return (
    <div className="flex h-screen items-center justify-center">
      <button
        className="rounded-full bg-green px-4 py-3 text-lg text-black transition-transform hover:scale-105"
        onClick={() => void signIn("spotify")}
      >
        Sign In With Spotify
      </button>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div
      role="status"
      className="divide-gray-200 border-gray-200 dark:divide-gray-700 dark:border-gray-700 max-w-md animate-pulse space-y-4 divide-y rounded border p-4 shadow md:p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="bg-gray-300 dark:bg-gray-600 mb-2.5 h-2.5 w-24 rounded-full"></div>
          <div className="bg-gray-200 dark:bg-gray-700 h-2 w-32 rounded-full"></div>
        </div>
        <div className="bg-gray-300 dark:bg-gray-700 h-2.5 w-12 rounded-full"></div>
      </div>
      <div className="flex items-center justify-between pt-4">
        <div>
          <div className="bg-gray-300 dark:bg-gray-600 mb-2.5 h-2.5 w-24 rounded-full"></div>
          <div className="bg-gray-200 dark:bg-gray-700 h-2 w-32 rounded-full"></div>
        </div>
        <div className="bg-gray-300 dark:bg-gray-700 h-2.5 w-12 rounded-full"></div>
      </div>
      <div className="flex items-center justify-between pt-4">
        <div>
          <div className="bg-gray-300 dark:bg-gray-600 mb-2.5 h-2.5 w-24 rounded-full"></div>
          <div className="bg-gray-200 dark:bg-gray-700 h-2 w-32 rounded-full"></div>
        </div>
        <div className="bg-gray-300 dark:bg-gray-700 h-2.5 w-12 rounded-full"></div>
      </div>
      <div className="flex items-center justify-between pt-4">
        <div>
          <div className="bg-gray-300 dark:bg-gray-600 mb-2.5 h-2.5 w-24 rounded-full"></div>
          <div className="bg-gray-200 dark:bg-gray-700 h-2 w-32 rounded-full"></div>
        </div>
        <div className="bg-gray-300 dark:bg-gray-700 h-2.5 w-12 rounded-full"></div>
      </div>
      <div className="flex items-center justify-between pt-4">
        <div>
          <div className="bg-gray-300 dark:bg-gray-600 mb-2.5 h-2.5 w-24 rounded-full"></div>
          <div className="bg-gray-200 dark:bg-gray-700 h-2 w-32 rounded-full"></div>
        </div>
        <div className="bg-gray-300 dark:bg-gray-700 h-2.5 w-12 rounded-full"></div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
