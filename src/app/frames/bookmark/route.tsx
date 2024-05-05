import { APP_URL } from "@/app/env";
import { getCastInfo } from "@/lib/neynar";
import { prisma } from "@/lib/prisma";
import { formatCategory, postUrl } from "@/lib/utils";
import { Button } from "frames.js/next";
import { frames } from "../frames";

const handler = frames(async (ctx) => {
  if (ctx.message) {
    const { requesterFid, castId, inputText, buttonIndex } = ctx.message;
    console.log(requesterFid, castId?.hash, inputText, buttonIndex);

    //fetch all categories of the user
    const categories = await prisma.categories.findMany({
      where: {
        fid: String(requesterFid),
      },
      select: {
        category: true,
        category_id: true,
      },
      distinct: ["category"],
    });

    if (inputText) {
      const { type } = ctx.searchParams;

      if (type) {
        if (type === "save") {
          //create a new category
          await prisma.categories.create({
            data: {
              category: inputText.toLowerCase(),
              fid: String(requesterFid),
            },
          });

          return {
            image: (
              <div tw="flex flex-col items-center justify-center p-10 text-[42px]">
                <div tw="text-[52px] mb-4">Category Created 🏮</div>
              </div>
            ),
            buttons: [
              <Button action="post" target={`${APP_URL}/frames/bookmark`}>
                ← Back
              </Button>,
            ],
          };
        } else if (type === "bookmark" && castId) {
          //resolve categoryId
          let catId = "";
          const catIds = categories.filter(
            (c) => c.category.toLowerCase() === inputText.toLowerCase(),
          );

          //no cat id
          if (catIds.length === 0) {
            const newCategory = await prisma.categories.create({
              data: {
                category: inputText.toLowerCase(),
                fid: String(requesterFid),
              },
            });
            catId = newCategory.category_id;
          } else {
            catId = catIds[0].category_id;
          }

          //get cast info
          const cast = await getCastInfo({ hash: castId?.hash, type: "hash" });
          const { text, embeds } = cast.conversation.cast;

          //save cast to a bookmark category
          await prisma.bookmarks.create({
            data: {
              category_id: catId,
              fid: String(requesterFid),
              hash: castId.hash,
              text,
              embeds,
            },
          });

          return {
            image: (
              <div tw="flex flex-col items-center justify-center p-10 text-[42px]">
                <div tw="text-[52px] mb-4">Bookmarked ✅</div>
              </div>
            ),
            buttons: [
              <Button action="post" target={`${APP_URL}/frames/bookmark`}>
                ← Back
              </Button>,
            ],
          };
        }
      }
    }

    //if category then send back a frame to select a category
    if (categories.length > 0) {
      const colors = [
        "lime",
        "rose",
        "purple",
        "amber",
        "indigo",
        "lime",
        "blue",
        "yellow",
        "pink",
      ];

      return {
        textInput: "Please enter category name",
        image: (
          <div tw="flex flex-col items-center p-5 text-[42px]">
            <div tw="text-[52px] mb-12 -mt-8">Bookmark Categories 🏮</div>
            <div tw="flex flex-wrap justify-center items-center text-[36px]">
              {categories.slice(0, 9).map((e: any, index: number) => (
                <div
                  key={index}
                  tw={`bg-${colors[index]}-500 text-white px-4 h-22 min-w-64 rounded-xl m-3 flex items-center justify-center`}
                >
                  {formatCategory(e.category)}
                </div>
              ))}
            </div>
          </div>
        ),
        buttons: [
          <Button action="post" target={postUrl({ param: "bookmark" })}>
            🔖 Bookmark
          </Button>,
        ],
      };
    }

    //if no categories send back a frame to create one
    return {
      textInput: "Please enter category name",
      image: (
        <div tw="flex flex-col items-center justify-center p-10 text-[42px]">
          <div tw="text-[52px] mb-4">Bookmark Categories 🏮</div>
          <div tw="text-[36px] px-52 text-center">
            You do not have any saved categories please create one
          </div>
        </div>
      ),
      buttons: [
        <Button action="post" target={postUrl({ param: "save" })}>
          💾 Save Category
        </Button>,
      ],
    };
  }

  return {
    image: (
      <div tw="flex flex-col items-center justify-center p-10 text-[42px]">
        <div tw="text-[52px] mb-4">Invalid Request 🏮</div>
      </div>
    ),
    buttons: [
      <Button action="post" target={`${APP_URL}/frames/bookmark`}>
        Try Again 🔄
      </Button>,
    ],
  };
});

export const POST = handler;
