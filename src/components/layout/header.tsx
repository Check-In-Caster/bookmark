import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePrivy } from "@privy-io/react-auth";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { SearchIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FaUser as UserIcon } from "react-icons/fa";

const Header = ({ hide }: { hide: boolean }) => {
  const [search, setSearch] = useState("");
  const { user } = usePrivy();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header
      className={`fixed z-[100] flex w-full max-w-md items-center justify-between border-b bg-white px-5 py-3 ${hide ? "hidden" : ""}`}
    >
      {(pathname === "/profile" ||
        pathname?.startsWith("/cast/0x") ||
        pathname?.startsWith("/invite") ||
        pathname?.startsWith("/channel/")) && (
        <Link href="/" passHref>
          <div className="flex h-9 w-9 items-center justify-center">
            <ChevronLeftIcon className="h-7 w-7" />
          </div>
        </Link>
      )}

      {!pathname?.startsWith("/cast/0x") &&
      !pathname?.startsWith("/invite") &&
      !pathname?.startsWith("/channel/") ? (
        <Link href="/" passHref>
          <Image
            src="/assets/logos/logo.png"
            alt="logo"
            width={30}
            height={30}
            priority
          />
        </Link>
      ) : (
        <div className="ml-3 w-full font-semibold">
          {pathname?.startsWith("/cast/0x")
            ? "Conversation"
            : `/${pathname.split("/")[2]}`}
        </div>
      )}

      <form
        onSubmit={() => {
          router.push(`/search?q=${search}`);
        }}
        className="relative"
      >
        <SearchIcon className="absolute left-[14px] top-[12px] h-4 w-4 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-full bg-[#E7ECF0] px-4 py-2 pl-10"
          placeholder="search..."
        />
      </form>
      <Link
        href="/profile"
        passHref
        className={
          pathname === "/profile" ||
          pathname?.startsWith("/cast/0x") ||
          pathname?.startsWith("/invite") ||
          pathname?.startsWith("/channel/")
            ? "sr-only"
            : ""
        }
      >
        <Avatar className="h-9 w-9">
          {user?.farcaster?.pfp && <AvatarImage src={user.farcaster.pfp} />}
          <AvatarFallback>
            <UserIcon />
          </AvatarFallback>
        </Avatar>
      </Link>
    </header>
  );
};

export default Header;
