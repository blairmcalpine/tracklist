import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ComponentType,
  type UIEvent,
} from "react";

export enum SortDirection {
  ASC = 1,
  DESC = -1,
}

export interface TableProps<Item> {
  items: Item[] | undefined;
  HeaderRow: ComponentType<{
    sortColumn: (column: keyof Item) => void;
    sortType: [keyof Item, SortDirection] | null;
  }>;
  Row: ComponentType<{ item: Item; idx: number }>;
  SkeletonRow: ComponentType<{ idx: number }>;
  expectedRows?: number;
  onScrollEnd?: () => void;
  loadingMore?: boolean;
}

export default function Table<Item>({
  items,
  HeaderRow,
  Row,
  SkeletonRow,
  expectedRows,
  onScrollEnd,
  loadingMore,
}: TableProps<Item>) {
  type Column = keyof Item;
  const [sortType, setSortType] = useState<[Column, SortDirection] | null>(
    null
  );
  const [sortedItems, setSortedItems] = useState<Item[] | undefined>(undefined);
  const emptyArray = useMemo(
    () => new Array(expectedRows ?? 50).fill(0) as number[],
    [expectedRows]
  );

  useEffect(() => {
    if (!items) return;
    if (!sortType) return setSortedItems(items);
    const [column, direction] = sortType;
    const sorted = [...items].sort((itemA, itemB) => {
      const a = itemA[column];
      const b = itemB[column];
      if (typeof a === "string" && typeof b === "string") {
        return a.localeCompare(b) * direction;
      } else if (typeof a === "number" && typeof b === "number") {
        return (a - b) * direction;
      } else if (
        typeof a === "object" &&
        typeof b === "object" &&
        a !== null &&
        b !== null &&
        "name" in a &&
        "name" in b &&
        typeof a.name === "string" &&
        typeof b.name === "string"
      ) {
        return a.name.localeCompare(b.name) * direction;
      }
      return 0;
    });
    setSortedItems(sorted);
  }, [sortType, items]);

  const onScroll = useCallback(
    (event: UIEvent<HTMLDivElement, globalThis.UIEvent>) => {
      if (!onScrollEnd) return;
      const element = event.target as HTMLDivElement;
      if (
        Math.abs(
          element.scrollHeight - element.scrollTop - element.clientHeight
        ) < 20
      ) {
        onScrollEnd();
      }
    },
    [onScrollEnd]
  );

  function sortColumn(category: Column) {
    if (!sortType) return setSortType([category, SortDirection.DESC]);
    if (sortType[0] === category) {
      if (sortType[1] === SortDirection.DESC)
        return setSortType([category, SortDirection.ASC]);
      if (sortType[1] === SortDirection.ASC) return setSortType(null);
    }
    setSortType([category, SortDirection.DESC]);
  }

  return (
    <div
      className="relative flex w-full flex-1 flex-col overflow-y-auto rounded bg-elevated px-2 md:px-5"
      onScroll={onScrollEnd ? onScroll : undefined}
    >
      <table className="w-full table-fixed border-separate border-spacing-0">
        <thead>
          <HeaderRow sortColumn={sortColumn} sortType={sortType} />
        </thead>
        <tbody>
          <tr className="h-4" />
          {sortedItems ? (
            <>
              {sortedItems.map((item, idx) => (
                <Row key={idx} item={item} idx={idx} />
              ))}
            </>
          ) : (
            <>
              {emptyArray.map((_, idx) => (
                <SkeletonRow key={idx} idx={idx} />
              ))}
            </>
          )}
        </tbody>
      </table>
      {loadingMore && (
        <div className="fixed bottom-[7rem] left-1/2 -translate-x-1/2">
          <svg
            aria-hidden="true"
            className="h-10 w-10 animate-spin fill-green text-black"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

export function SortIcon<Item>({
  sortType,
  category,
}: {
  sortType: [keyof Item, SortDirection] | null;
  category: keyof Item;
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
