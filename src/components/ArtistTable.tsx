import type { RouterOutputs } from "@/utils/api";
import Image from "next/image";
import { useEffect, useState } from "react";
import { defaultImage } from "./AuthBar";

type SpotifyArtists = RouterOutputs["spotify"]["getTopArtists"];

enum SortCategory {
  NAME = "NAME",
  POPULARITY = "POPULARITY",
}
enum SortDirection {
  ASC = 1,
  DESC = -1,
}

export default function ArtistTable({
  artists,
}: {
  artists: SpotifyArtists | undefined;
}) {
  const [sortType, setSortType] = useState<
    [SortCategory, SortDirection] | null
  >(null);
  const [sortedArtists, setSortedArtists] = useState<
    SpotifyArtists | undefined
  >(undefined);

  useEffect(() => {
    if (!artists) return;
    if (!sortType) return setSortedArtists(artists);
    const [type, direction] = sortType;
    const sorted = [...artists].sort((a, b) => {
      switch (type) {
        case SortCategory.NAME:
          return a.name.localeCompare(b.name) * direction;
        case SortCategory.POPULARITY:
          return (a.popularity - b.popularity) * direction;
        default:
          return 0;
      }
    });
    setSortedArtists(sorted);
  }, [sortType, artists]);

  function columnClick(category: SortCategory) {
    if (!sortType) return setSortType([category, SortDirection.ASC]);
    if (sortType[0] === category) {
      if (sortType[1] === SortDirection.ASC)
        return setSortType([category, SortDirection.DESC]);
      if (sortType[1] === SortDirection.DESC) return setSortType(null);
    }
    setSortType([category, SortDirection.ASC]);
  }

  return (
    <div className="max-h-[50vh] w-full overflow-y-auto rounded bg-elevated px-5">
      <table className="w-full border-separate border-spacing-0">
        <thead>
          <tr>
            <th className="sticky top-0 w-[1%] whitespace-nowrap border-b-[1px] bg-elevated pb-2 pr-3 pt-5 text-right font-thin text-gray">
              #
            </th>
            <th className="sticky top-0 z-10 w-[1%] min-w-[58px] border-b-[1px] bg-elevated text-gray"></th>
            <th className="sticky top-0 z-10 w-[50%] border-b-[1px] bg-elevated pb-2 pl-3 pt-5 text-left font-thin text-gray">
              <button
                className="flex items-center gap-2 hover:text-white"
                onClick={() => columnClick(SortCategory.NAME)}
              >
                Artist
                <SortIcon sortType={sortType} category={SortCategory.NAME} />
              </button>
            </th>
            <th className="sticky top-0 z-10 w-[48%] border-b-[1px] bg-elevated pb-2 pt-5 font-thin text-gray">
              <div className="flex justify-end">
                <button
                  className="flex items-center justify-end gap-2 text-right hover:text-white"
                  onClick={() => columnClick(SortCategory.POPULARITY)}
                >
                  <SortIcon
                    sortType={sortType}
                    category={SortCategory.POPULARITY}
                  />
                  Popularity
                </button>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="h-4" />
          {sortedArtists ? (
            <>
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
                    <td className="text-right">{popularity}</td>
                  </tr>
                )
              )}
            </>
          ) : (
            <SkeletonTable />
          )}
        </tbody>
      </table>
    </div>
  );
}

const arrayOf50 = new Array(50).fill(undefined);

function SkeletonTable() {
  return (
    <>
      {arrayOf50.map((_, idx) => (
        <tr key={idx}>
          <td className="pr-3 text-right font-thin text-gray">{idx + 1}</td>
          <td>
            <div className="h-14 w-14 animate-pulse rounded-full bg-highlighted" />
          </td>
          <td>
            <div className="flex flex-col p-3 ">
              <div className="my-1 h-4 w-[60%] animate-pulse rounded-full bg-highlighted" />
              <div className="my-[3px] h-3.5 w-[35%] animate-pulse rounded-full bg-highlighted" />
            </div>
          </td>
          <td>
            <div className="flex items-center justify-end">
              <div className=" my-1 h-4 w-6 animate-pulse rounded-full bg-highlighted" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}

function SortIcon({
  sortType,
  category,
}: {
  sortType: [SortCategory, SortDirection] | null;
  category: SortCategory;
}) {
  if (!sortType || sortType[0] !== category) return null;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 12 6"
      fill="#1ed760"
      className={`h-3 w-3 transition-transform duration-200 ${
        sortType[1] === SortDirection.ASC ? "rotate-180" : ""
      }`}
    >
      <polygon points="0,0 12,0 6,6" />
    </svg>
  );
}
