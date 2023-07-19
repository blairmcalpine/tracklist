import type {
  SpotifyAlbum,
  SpotifyListResponse,
  SpotifyReducedTrack,
  SpotifyTrack,
  SpotifyTracksResponse,
} from "@/types/spotify";
import { z } from "zod";
import { spotifyFetch } from "../root";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const albumRouter = createTRPCRouter({
  album: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const { token } = ctx.session;
    // Get album data
    const data = (await spotifyFetch(
      `/albums/${input}`,
      token
    )) as SpotifyAlbum;
    let next = data.tracks.next;
    // Get all tracks
    while (next) {
      const response = (await spotifyFetch(
        next,
        token,
        true
      )) as SpotifyListResponse<SpotifyReducedTrack>;
      data.tracks.items.push(...response.items);
      next = response.next;
    }
    // Batch tracks into groups of 50
    const trackQueries = data.tracks.items.reduce((acc: string[], cur, i) => {
      if (i % 50 === 0) acc.push("/tracks?ids=");
      if (i % 50 === 49 || i === data.tracks.items.length - 1)
        acc[acc.length - 1] += cur.id;
      else acc[acc.length - 1] += cur.id + ",";
      return acc;
    }, []);
    // Get track data
    const trackResult = (await spotifyFetch(
      trackQueries,
      token
    )) as SpotifyTracksResponse[];
    // Flatten track data from each query
    const tracks = trackResult.reduce((acc: SpotifyTrack[], cur) => {
      acc.push(...cur.tracks);
      return acc;
    }, []);
    return {
      album: data,
      tracks,
    };
  }),
});
