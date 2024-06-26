import { SearchIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import {
  RiHome7Fill as HomeFilledIcon,
  RiHome7Line as HomeIcon,
} from "react-icons/ri";

export const MenuItem: React.FC<{
  link: string;
  icon: React.ReactNode;
  filledIcon: React.ReactNode;
  active?: boolean;
}> = ({ link, icon, filledIcon, active }) => {
  return (
    <Link href={link} prefetch legacyBehavior>
      <li
        className={`cursor-pointer rounded-lg hover:bg-gray-50 md:p-4 md:px-8  ${active ? "text-[#8680ff]" : "text-[#b8b8b8]"}`}
      >
        {active ? filledIcon : icon}
      </li>
    </Link>
  );
};

const Footer = ({ hide }: { hide: boolean }) => {
  const pathname = usePathname();
  const router = useRouter();

  const excludeCastBtnPaths = ["/cast/new", "/signin"];
  const showCastBtn = pathname
    ? !excludeCastBtnPaths.includes(pathname) &&
      !["/auth/", "/cast"].some((path) => pathname.startsWith(path))
    : false;

  return (
    <footer
      className={`fixed bottom-0 z-50 w-full max-w-5xl border-black  border-opacity-10 bg-white pb-[env(safe-area-inset-bottom)] md:hidden   ${hide ? "hidden" : ""}
      ${pathname?.startsWith("/cast/") ? "" : "border-t "}
      `}
    >
      <div className="px-5 py-4">
        <ul className="flex justify-around">
          <MenuItem
            link="/"
            icon={<HomeIcon className="h-6 w-6" />}
            filledIcon={<HomeFilledIcon className="h-6 w-6" />}
            active={pathname === "/"}
          />
          <MenuItem
            link="/discover"
            icon={<SearchIcon className="h-6 w-6" />}
            filledIcon={<SearchIcon className="h-6 w-6" />}
            active={pathname?.startsWith("/discover")}
          />
          {/* <MenuItem
            link="/profile"
            icon={<ProfileIcon className="h-6 w-6" />}
            filledIcon={<ProfileFilledIcon className="h-6 w-6" />}
            active={pathname?.startsWith("/profile")}
          /> */}
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
