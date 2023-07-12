import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

export const defaultImage =
  "https://i.scdn.co/image/ab6761610000517458efbed422ab46484466822b";

export default function AuthBar() {
  const { data: sessionData } = useSession();

  if (!sessionData?.user) return null;

  return (
    <button className="group fixed right-4 top-4 flex items-center gap-3">
      <p className="text-xl">{sessionData.user.name ?? sessionData.user.id}</p>
      <div className="rounded-full transition-shadow group-hover:shadow-greenBorder">
        <Image
          src={sessionData.user.image ?? defaultImage}
          width={48}
          height={48}
          className="h-12 w-12 rounded-full"
          alt={sessionData.user.name ?? "Profile Picture"}
        />
      </div>
    </button>
  );
}
