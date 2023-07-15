import type {
  SpotifyArtist,
  SpotifyListResponse,
  SpotifySearchResult,
  SpotifyTrack,
} from "@/types/spotify";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const spotifyRouter = createTRPCRouter({
  getTopArtists: protectedProcedure.query(async ({ ctx }) => {
    const { token } = ctx.session;
    const response = await fetch(
      "https://api.spotify.com/v1/me/top/artists?limit=50",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching top artists",
      });
    const data = (await response.json()) as SpotifyListResponse<SpotifyArtist>;
    return data.items;
  }),
  getTopTracks: protectedProcedure.query(async ({ ctx }) => {
    const { token } = ctx.session;
    const response = await fetch(
      "https://api.spotify.com/v1/me/top/tracks?limit=50",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching top songs",
      });
    const data = (await response.json()) as SpotifyListResponse<SpotifyTrack>;
    return data.items;
  }),
  search: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const { token } = ctx.session;
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${input}&type=artist&limit=20`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error searching",
      });
    const data = (await response.json()) as SpotifySearchResult;
    return data.artists.items;
  }),
});
