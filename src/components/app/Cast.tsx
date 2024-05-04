"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { FaUser as UserIcon } from "react-icons/fa";
import CastBtns from "./cast-btns";
import Embed from "./embed";
import CastWrapper from "./wrapper";

interface CastProps {
  hash: string;

  category?: string;
  author: {
    fid: string | number;
    username: string;
    display_name: string;
    pfp_url: string;
  };
  text: string;
  timestamp: string;
  embeds: {
    url: string;
  }[];
  reactions: {
    likes: string | number;
    recasts: string | number;
    replies: string | number;
    bookmarked?: boolean;
  };
}

const getTimeText = (timestamp: string) => {
  const secondsPassed = Math.floor(
    (Date.now() - new Date(timestamp).getTime()) / 1000,
  );
  const minutesPassed = Math.floor(secondsPassed / 60);
  const hoursPassed = Math.floor(minutesPassed / 60);
  const daysPassed = Math.floor(minutesPassed / (60 * 24));
  const weeksPassed = Math.floor(minutesPassed / (60 * 24 * 7));
  const monthsPassed = Math.floor(minutesPassed / (60 * 24 * 30));
  const yearsPassed = Math.floor(minutesPassed / (60 * 24 * 365));
  return yearsPassed > 0
    ? `${yearsPassed}y`
    : monthsPassed > 0
      ? `${monthsPassed}mo`
      : weeksPassed > 0
        ? `${weeksPassed}w`
        : daysPassed > 0
          ? `${daysPassed}d`
          : hoursPassed > 0
            ? `${hoursPassed}h`
            : minutesPassed > 0
              ? `${minutesPassed}m`
              : `${secondsPassed}s`;
};

const Cast: React.FC<CastProps> = ({
  hash,
  author,
  text,
  category,
  timestamp,
  embeds,
  reactions,
}) => {
  const { user } = usePrivy();
  const loggedInUserFid = user?.farcaster?.fid;
  const { pending } = useFormStatus();

  const timeText = getTimeText(timestamp);

  const textToHTML = (text: string, locationName?: string) => {
    text = text.trim();

    const urlMatches = text.match(/((?:https?:\/\/|www\.)[^\s]+)/g);

    if (urlMatches) {
      const lastUrl = urlMatches[urlMatches.length - 1];
      if (
        text.endsWith(lastUrl) &&
        (lastUrl.startsWith("https://maps.app.goo.gl/") ||
          lastUrl.startsWith("https://app.checkincaster.xyz/m/"))
      ) {
        text = text.replace(lastUrl, "");
      }
    }

    text = text
      .replace(/((?:https?:\/\/|www\.)[^\s]+)/g, function (match) {
        if (
          match.startsWith("https://maps.app.goo.gl/") ||
          match.startsWith("https://app.checkincaster.xyz/m/")
        ) {
          return `<a href="${match}" target="_blank" rel="noopener noreferrer" class="underline">${locationName}</a>`;
        } else {
          return `<a href="${match}" target="_blank" rel="noopener noreferrer" class="underline">${match}</a>`;
        }
      })
      .replace(/\n/g, "<br>");

    text = text.trim();
    while (text.endsWith("<br>")) {
      text = text.slice(0, -4);
      text = text.trim();
    }

    return text;
  };

  return (
    <CastWrapper
      href={`https://warpcast.com/${author.username}/${hash.slice(0, 10)}`}
    >
      <div className="col-span-2 pr-3">
        <Link href={`/profile/${author.fid}`} passHref>
          <Avatar className="h-auto w-full">
            <AvatarImage src={author.pfp_url} alt={`@${author.username}`} />
            <AvatarFallback>
              <UserIcon />
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>

      <div className="col-span-12">
        <div>
          <Link href={`/profile/${author.fid}`} passHref>
            <span className="font-semibold">{author.display_name}</span>{" "}
            <span className="text-gray-500">@{author.username}</span>
          </Link>
          <span className="text-gray-500">
            &nbsp;&nbsp;·&nbsp;
            {timeText}
          </span>
        </div>

        <p
          dangerouslySetInnerHTML={{
            __html: textToHTML(text.replace("@checkin", "")),
          }}
          className="mt-2 break-words font-[16px]"
        ></p>

        <div className="w-full">
          {embeds.filter(
            (i) =>
              !(
                i?.url?.includes("maps.app.goo.gl") ||
                i?.url?.includes("app.checkincaster.xyz/m")
              ),
          ).length === 0 ? (
            <></>
          ) : (
            embeds.map((embed, index) => (
              <Embed key={hash + index} url={embed.url} />
            ))
          )}
        </div>

        <div className="flex justify-between">
          <ul className="mt-4 flex justify-between space-x-2 text-[#687684]">
            <CastBtns
              hash={hash}
              author_fid={Number(author.fid)}
              type="reply"
              text={reactions.replies.toString()}
            />
            <CastBtns
              hash={hash}
              author_fid={Number(author.fid)}
              type="recast"
              completed={false}
            />
            <CastBtns hash={hash} author_fid={Number(author.fid)} type="like" />
          </ul>
        </div>
      </div>
    </CastWrapper>
  );
};

export default Cast;
