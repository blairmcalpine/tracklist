import type {
  SpotifyArtist,
  SpotifyListResponse,
  SpotifyTrack,
} from "@/types/spotify";
import { spotifyFetch } from "../root";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  topItems: protectedProcedure.query(async ({ ctx }) => {
    const { token } = ctx.session;
    const [artists, tracks] = (await spotifyFetch(
      ["/me/top/artists?limit=50", "/me/top/tracks?limit=50"],
      token
    )) as [
      SpotifyListResponse<SpotifyArtist>,
      SpotifyListResponse<SpotifyTrack>
    ];
    return { artists: artists.items, tracks: tracks.items };
  }),
});
