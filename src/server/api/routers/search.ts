import type { SpotifySearchResult } from "@/types/spotify";
import { z } from "zod";
import { spotifyFetch } from "../root";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const searchRouter = createTRPCRouter({
  search: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const { token } = ctx.session;
    const data = (await spotifyFetch(
      `/search?q=${input}&type=artist&limit=20`,
      token
    )) as SpotifySearchResult;
    return data.artists.items;
  }),
});
