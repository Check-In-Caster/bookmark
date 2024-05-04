"use client";

import { useExperimentalFarcasterSigner, usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { FaRegCommentAlt as ReplyIcon } from "react-icons/fa";
import { FaRetweet as RecastIcon } from "react-icons/fa6";
import { IoHeartOutline as HeartIcon } from "react-icons/io5";
import {
  RiBookmarkLine as BookmarkIcon,
  RiBookmarkFill as BookmarkIconFilled,
} from "react-icons/ri";
import { TbUpload as ShareIcon } from "react-icons/tb";
import { toast } from "sonner";

const CastBtns: React.FC<{
  type: "reply" | "recast" | "like" | "share" | "bookmark";
  text?: string;
  author_fid?: number;
  completed?: boolean;
  hash?: string;
}> = ({ type, text, hash, author_fid, completed = false }) => {
  const [currentValue, setCurrentValue] = useState<number>(
    text ? Number(text) : 0,
  );
  const [actionCompleted, setActionCompleted] = useState<boolean>(completed);

  useEffect(() => {
    setActionCompleted(completed);
  }, [completed]);

  const { user } = usePrivy();

  const farcasterAccount = user?.linkedAccounts.find(
    (account) => account.type === "farcaster",
  );

  const { likeCast, recastCast, requestFarcasterSigner } =
    useExperimentalFarcasterSigner();

  const handleAction = async (action: string) => {
    if (author_fid && hash) {
      if (
        // @ts-ignore
        farcasterAccount?.signerPublicKey
      ) {
        if (actionCompleted) {
          return;
        }

        setActionCompleted(true);
        setCurrentValue(currentValue + 1);

        if (action == "like") {
          const response = await likeCast({
            castAuthorFid: Number(author_fid),
            castHash: hash,
          });
          console.log(response);
        }
        if (action == "recast") {
          const response = await recastCast({
            castAuthorFid: Number(author_fid),
            castHash: hash,
          });
          console.log(response);
        }
      } else {
        requestFarcasterSigner();
      }
    } else {
      toast.error("You must be logged in to like a cast");
    }
  };

  const replyHandler = () => {
    console.log("reply");
  };

  const recastHandler = () => {
    handleAction("recast");
  };

  const likeHandler = async () => {
    handleAction("like");
  };

  const shareHandler = () => {
    console.log("share");
  };

  const bookmarkHandler = () => {
    setActionCompleted(!actionCompleted);
  };

  return (
    <li
      className="flex cursor-pointer items-center rounded-md p-2 hover:bg-gray-100"
      onClick={() => {
        if (type === "reply") replyHandler();
        if (type === "recast") recastHandler();
        if (type === "like") likeHandler();
        if (type === "share") shareHandler();
        if (type === "bookmark") bookmarkHandler();
      }}
    >
      {type === "reply" && <ReplyIcon />}
      {type === "recast" && (
        <RecastIcon className={actionCompleted ? "text-[#0cc355]" : ""} />
      )}
      {type === "bookmark" && (
        <>
          {actionCompleted ? (
            <BookmarkIconFilled className="text-[#7bb353]" />
          ) : (
            <BookmarkIcon />
          )}
        </>
      )}

      {type === "like" && (
        <HeartIcon className={actionCompleted ? "liked" : ""} />
      )}
      {type === "share" && <ShareIcon />}
      {text && <div className="ml-1 text-xs">{currentValue}</div>}
    </li>
  );
};

export default CastBtns;
