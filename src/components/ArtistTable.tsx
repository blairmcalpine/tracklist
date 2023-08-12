import type { SpotifyArtist } from "@/types/spotify";
import Image from "next/image";
import { useRouter } from "next/router";
import { defaultImage } from "./AuthBar";
import Table, { SortIcon, type SortDirection, type TableProps } from "./Table";

type ArtistTableProps = Omit<
  TableProps<SpotifyArtist>,
  "Row" | "SkeletonRow" | "items" | "HeaderRow"
> & {
  artists: SpotifyArtist[] | undefined;
};

export default function ArtistTable({ artists, ...rest }: ArtistTableProps) {
  return (
    <Table
      items={artists}
      HeaderRow={HeaderRow}
      Row={Row}
      SkeletonRow={SkeletonRow}
      {...rest}
    />
  );
}

function HeaderRow({
  sortColumn,
  sortType,
}: {
  sortColumn: (category: keyof SpotifyArtist) => void;
  sortType: [keyof SpotifyArtist, SortDirection] | null;
}) {
  return (
    <tr>
      <th className="sticky top-0 w-[10%] whitespace-nowrap border-b-[1px] bg-elevated pb-2 pt-5 text-right font-thin text-gray md:w-[4%]">
        #
      </th>
      <th className="sticky top-0 z-10 w-[82px] border-b-[1px] bg-elevated text-gray"></th>
      <th className="sticky top-0 z-10 w-[70%] border-b-[1px] bg-elevated pb-2 pt-5 text-left font-thin text-gray">
        <button
          className="flex items-center gap-2 hover:text-white"
          onClick={() => sortColumn("name")}
        >
          Artist
          <SortIcon sortType={sortType} category={"name"} />
        </button>
      </th>
      <th className="sticky top-0 z-10 w-[30%] border-b-[1px] bg-elevated pb-2 pt-5 font-thin text-gray">
        <div className="flex justify-end">
          <button
            className="flex items-center justify-end gap-2 text-right hover:text-white"
            onClick={() => sortColumn("popularity")}
          >
            <SortIcon sortType={sortType} category={"popularity"} />
            Popularity
          </button>
        </div>
      </th>
    </tr>
  );
}

function Row({ item, idx }: { item: SpotifyArtist; idx: number }) {
  const { name, genres, popularity, images, id } = item;
  const { push } = useRouter();
  return (
    <tr
      className="cursor-pointer hover:bg-white hover:bg-opacity-10"
      onClick={() => void push(`/artist/${id}`)}
    >
      <td className="text-right font-thin text-gray">{idx + 1}</td>
      <td>
        <Image
          className="mx-auto my-1.5 h-14 w-14 object-cover"
          src={images[0]?.url ?? defaultImage}
          alt={name}
          width={56}
          height={56}
        />
      </td>
      <td className="whitespace-nowrap">
        <div className="flex flex-col">
          <p>{name}</p>
          <p className="text-sm font-thin capitalize text-gray">{genres[0]}</p>
        </div>
      </td>
      <td className="text-right">
        <p className="md:pr-3">{popularity}%</p>
      </td>
    </tr>
  );
}

function SkeletonRow({ idx }: { idx: number }) {
  return (
    <tr>
      <td className="text-right font-thin text-gray">{idx + 1}</td>
      <td>
        <div className="m-auto h-14 w-14 animate-pulse rounded-full bg-highlighted" />
      </td>
      <td>
        <div className="flex flex-col py-3">
          <div className="my-1 h-4 w-[40%] animate-pulse rounded-full bg-highlighted" />
          <div className="my-[3px] h-3.5 w-[20%] animate-pulse rounded-full bg-highlighted" />
        </div>
      </td>
      <td>
        <div className="flex items-center justify-end">
          <div className="my-1 h-4 w-6 animate-pulse rounded-full bg-highlighted" />
        </div>
      </td>
    </tr>
  );
}
