import { Button } from "frames.js/next";
import { APP_URL } from "../env";
import { frames } from "./frames";

const handler = frames(async (ctx) => {
  const installAction = `https://warpcast.com/~/add-cast-action?url=${encodeURIComponent(
    `${APP_URL}/frames/actions/bookmark`,
  )}`;

  return {
    image: (
      <div tw="flex flex-col items-center justify-center">
        <div tw="text-[52px] mb-4">Bookmark Action 📝</div>
        <div tw="text-[36px] px-20 text-center">
          Install bookmark cast action and use it to bookmark any cast or use
          @bookmark bot to bookmark
        </div>
      </div>
    ),
    buttons: [
      <Button action="link" target={installAction}>
        Install Bookmark Action
      </Button>,
    ],
  };
});

export const POST = handler;
export const GET = handler;
