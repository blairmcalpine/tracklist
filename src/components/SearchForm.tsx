import MagnifyingGlass from "@/icons/MagnifyingGlass";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState, type FormEvent } from "react";

export default function SearchForm() {
  const {
    push,
    query: { search: searchQuery },
  } = useRouter();
  const [search, setSearch] = useState("");
  const canSearch = useMemo(
    () => search !== "" && search !== searchQuery,
    [search, searchQuery]
  );

  useEffect(() => {
    if (typeof searchQuery !== "string" || search !== "") return;
    setSearch(searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  function onSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSearch) return;
    void push(`/search/${search}`);
  }

  return (
    <form
      role="search"
      onSubmit={onSearch}
      className="relative w-full max-w-sm"
    >
      <MagnifyingGlass className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 fill-highlighted" />
      <input
        className="w-full rounded-full bg-white px-10 pb-[15px] pt-[17px] text-black outline-none  placeholder:font-thin placeholder:text-highlighted"
        placeholder="Search for an artist"
        maxLength={50}
        name="search"
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button
        type="submit"
        className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full px-4 py-[1.25rem]"
        disabled={!canSearch}
      >
        <svg
          viewBox="0 0 16 16"
          className={`h-4 w-4 ${canSearch ? "fill-highlighted" : "fill-gray"}`}
        >
          <path d="M4.97.47a.75.75 0 0 0 0 1.06L11.44 8l-6.47 6.47a.75.75 0 1 0 1.06 1.06L13.56 8 6.03.47a.75.75 0 0 0-1.06 0z"></path>
        </svg>
      </button>
    </form>
  );
}
