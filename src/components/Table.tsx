import { useEffect, useMemo, useState, type ComponentType } from "react";

export enum SortDirection {
  ASC = 1,
  DESC = -1,
}

export default function Table<Item>({
  items,
  HeaderRow,
  Row,
  SkeletonRow,
  expectedRows,
}: {
  items: Item[] | undefined;
  HeaderRow: ComponentType<{
    sortColumn: (column: keyof Item) => void;
    sortType: [keyof Item, SortDirection] | null;
  }>;
  Row: ComponentType<{ item: Item; idx: number }>;
  SkeletonRow: ComponentType<{ idx: number }>;
  expectedRows?: number;
}) {
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

  function sortColumn(category: Column) {
    if (!sortType) return setSortType([category, SortDirection.ASC]);
    if (sortType[0] === category) {
      if (sortType[1] === SortDirection.ASC)
        return setSortType([category, SortDirection.DESC]);
      if (sortType[1] === SortDirection.DESC) return setSortType(null);
    }
    setSortType([category, SortDirection.ASC]);
  }

  return (
    <div className="w-full overflow-y-auto rounded bg-elevated px-5">
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
