import MagnifyingGlass from "@/icons/MagnifyingGlass";
import Link from "next/link";

export default function SearchButton() {
  return (
    <Link href="/" className="fixed left-16 top-8" title="Return to Search">
      <MagnifyingGlass fill="white" className="h-6 w-6" />
    </Link>
  );
}
