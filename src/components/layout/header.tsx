import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePrivy } from "@privy-io/react-auth";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUser as UserIcon } from "react-icons/fa";

const Header = ({ hide }: { hide: boolean }) => {
  const { user } = usePrivy();
  const pathname = usePathname();

  return (
    <header
      className={`fixed z-[100] flex w-full max-w-md items-center justify-between border-b bg-white px-5 py-3 ${hide ? "hidden" : ""}`}
    >
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
            width={40}
            height={40}
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

      <div className="h-9 w-9"></div>
    </header>
  );
};

export default Header;
