import { createTRPCRouter } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { artistRouter } from "./routers/artist";
import { searchRouter } from "./routers/search";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  artist: artistRouter,
  search: searchRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

export async function spotifyFetch(
  url: string | string[],
  token: string,
  excludeBasePath = false
) {
  const baseUrl = excludeBasePath ? "" : "https://api.spotify.com/v1";
  if (typeof url === "string") {
    const response = await fetch(`${baseUrl}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      console.log(await response.json());
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching from spotify",
      });
    }
    return response.json() as unknown;
  } else {
    const responses = await Promise.all(
      url.map((u) =>
        fetch(`${baseUrl}${u}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      )
    );
    if (responses.some((r) => !r.ok)) {
      console.log(await responses.find((r) => !r.ok)?.json());
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching from spotify",
      });
    }
    const data = await Promise.all(responses.map((r) => r.json()));
    return data as unknown[];
  }
}
