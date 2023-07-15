import { useRouter } from "next/router";
import { FormEvent, useEffect, useMemo, useState } from "react";

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
    <form className="relative" role="search" onSubmit={onSearch}>
      <svg
        viewBox="0 0 16 16"
        className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 fill-highlighted"
      >
        <path d="M7 1.75a5.25 5.25 0 1 0 0 10.5 5.25 5.25 0 0 0 0-10.5zM.25 7a6.75 6.75 0 1 1 12.096 4.12l3.184 3.185a.75.75 0 1 1-1.06 1.06L11.304 12.2A6.75 6.75 0 0 1 .25 7z"></path>
      </svg>
      <input
        className="w-96 rounded-full bg-white px-10 py-4 text-black outline-none placeholder:font-thin placeholder:text-highlighted"
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
