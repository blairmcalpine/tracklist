import { Menu, Transition } from "@headlessui/react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export const defaultImage =
  "https://i.scdn.co/image/ab6761610000517458efbed422ab46484466822b";

export default function AuthBar() {
  const { data: sessionData } = useSession();

  if (!sessionData) return null;

  return (
    <Menu
      className="fixed right-5 top-5 z-10 flex flex-col items-end gap-2"
      as="div"
    >
      <Menu.Button className="group flex items-center gap-3">
        <p className="text-xl">
          {sessionData.user.name ?? sessionData.user.id}
        </p>
        <div className="rounded-full transition-shadow group-hover:shadow-greenBorder">
          <Image
            src={sessionData.user.image ?? defaultImage}
            width={48}
            height={48}
            className="h-12 w-12 rounded-full"
            alt={sessionData.user.name ?? "Profile Picture"}
          />
        </div>
      </Menu.Button>
      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Menu.Items className="flex flex-col rounded bg-elevated p-1 shadow-lg">
          <Menu.Item>
            <Link
              className="rounded p-2 text-left hover:bg-highlighted"
              href="/profile"
            >
              View Profile
            </Link>
          </Menu.Item>
          <Menu.Item>
            <button
              className="p-2 text-left hover:bg-highlighted"
              onClick={() => void signOut({ callbackUrl: "/" })}
            >
              Sign Out
            </button>
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
