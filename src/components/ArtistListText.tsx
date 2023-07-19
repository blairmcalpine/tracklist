import type { SpotifyReducedArtist } from "@/types/spotify";
import Link from "next/link";
import { Fragment } from "react";

export default function ArtistListText({
  artists,
  separator = ", ",
}: {
  artists: SpotifyReducedArtist[];
  separator?: string;
}) {
  return (
    <>
      {artists.map((artist, idx) => (
        <Fragment key={idx}>
          <Link
            className="hover:text-white hover:underline"
            href={`/artist/${artist.id}`}
          >
            {artist.name}
          </Link>
          {idx !== artists.length - 1 && (
            <span className="whitespace-pre">{separator}</span>
          )}
        </Fragment>
      ))}
    </>
  );
}
