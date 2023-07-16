import type {
  SpotifyArtist,
  SpotifyListResponse,
  SpotifyReducedAlbum,
  SpotifyReducedTrack,
  SpotifyTracksResponse,
} from "@/types/spotify";
import { z } from "zod";
import { spotifyFetch } from "../root";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const artistRouter = createTRPCRouter({
  artist: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const { token } = ctx.session;
    const data = (await spotifyFetch(
      `/artists/${input}`,
      token
    )) as SpotifyArtist;
    return data;
  }),
  tracks: protectedProcedure
    .input(
      z.object({
        artistId: z.string(),
        cursor: z
          .object({
            albumCursor: z.number(),
            trackCursor: z.number(),
          })
          .nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { token } = ctx.session;
      const { artistId, cursor } = input;
      const albumOffset = cursor?.albumCursor ?? 0;
      const trackOffset = cursor?.trackCursor ?? 0;

      const albums = (await spotifyFetch(
        `/artists/${artistId}/albums?include_groups=album&limit=50&offset=${albumOffset}`,
        token
      )) as SpotifyListResponse<SpotifyReducedAlbum>;

      let totalTracks = trackOffset * -1;
      const albumsToFetch = [];
      let newCursor: typeof cursor = { albumCursor: 0, trackCursor: 0 };
      if (albums.items.length === 0) {
        return {
          tracks: [],
          cursor: undefined,
        };
      }
      for (const album of albums.items) {
        totalTracks += album.total_tracks;
        albumsToFetch.push(album.id);
        if (totalTracks > 50) {
          newCursor.trackCursor = album.total_tracks - (totalTracks - 50);
          newCursor.albumCursor = albumOffset + albumsToFetch.length - 1;
          break;
        }
        if (totalTracks === 50) {
          newCursor.trackCursor = 0;
          newCursor.albumCursor = albumOffset + albumsToFetch.length;
          break;
        }
      }

      if (totalTracks < 50) {
        newCursor = undefined;
      }
      const albumTracks = (
        await Promise.all(
          albumsToFetch.map(async (id) => {
            const albumTracks = (await spotifyFetch(
              `/albums/${id}/tracks?limit=50`,
              token
            )) as SpotifyListResponse<SpotifyReducedTrack>;
            return albumTracks.items;
          })
        )
      ).flat();

      const newTracks = albumTracks
        .slice(trackOffset, trackOffset + 50)
        .map((t) => t.id);

      const { tracks } = (await spotifyFetch(
        `/tracks?ids=${newTracks.join(",")}`,
        token
      )) as SpotifyTracksResponse;

      return {
        tracks,
        cursor: newCursor,
      };
    }),
});
