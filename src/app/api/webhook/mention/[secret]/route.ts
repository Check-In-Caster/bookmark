import { getCastInfo, replyCast } from "@/lib/neynar";
import { prisma } from "@/lib/prisma";
import { extractCategory } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Record<string, string> },
) {
  const rawBody = await request.text();
  const data = JSON.parse(rawBody);
  const secret = params.secret;

  if (secret !== process.env.NEYNAR_WEBHOOK_SIGNATURE) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      { status: 401 },
    );
  }

  const { parent_hash, text, author, hash } = data.data;

  if (!parent_hash) {
    return NextResponse.json(
      {
        message: "Not a valid bookmark cast",
      },
      { status: 400 },
    );
  }

  const category = extractCategory(text.replace("@undefined", "@bookmark"));

  if (!category || category === "") {
    return NextResponse.json(
      {
        message: "Couldn't extract category",
      },
      { status: 400 },
    );
  }

  const _c = await prisma.categories.findFirst({
    where: {
      category,
      fid: String(author.fid),
    },
    select: {
      category_id: true,
    },
  });

  let categoryId = null;

  if (!_c?.category_id) {
    const categoryRecord = await prisma.categories.create({
      data: {
        category,
        fid: String(author.fid),
      },
      select: {
        category_id: true,
      },
    });

    categoryId = categoryRecord.category_id;
  } else {
    categoryId = _c?.category_id;
  }

  //check if the cast is a reply to a cast by checking if it has a parent
  if (parent_hash) {
    //fetch the parent cast
    const cast = await getCastInfo({
      hash: parent_hash,
      type: "hash",
    });

    if (cast) {
      const { text, embeds } = cast.conversation.cast;

      //create bookmark
      await prisma.bookmarks.create({
        data: {
          category_id: categoryId,
          fid: String(author.fid),
          hash: parent_hash,
          text,
          embeds,
        },
      });

      await replyCast({
        parentId: hash,
      });
    } else {
      return NextResponse.json(
        {
          message: "Parent cast not found",
        },
        { status: 400 },
      );
    }
  }

  return NextResponse.json(
    {
      message: "Bookmarked Successfully",
    },
    { status: 200 },
  );
}
