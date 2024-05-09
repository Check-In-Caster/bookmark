import Cast from "@/components/app/Cast";
import Category from "@/components/app/Category";
import HomeLoading from "@/components/layout/home-loading";
import { getCasts } from "@/lib/neynar";
import { prisma } from "@/lib/prisma";
import { getVerifiedClaims, privy } from "@/lib/privy";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const getCategories = async ({
  fid,
  categoryId,
  search,
  discover = false,
}: {
  fid: string;
  categoryId?: string;
  search?: string;
  discover?: boolean;
}) => {
  const categories = await prisma.categories.findMany({
    where: {
      fid: fid,
    },
  });

  const casts = await prisma.bookmarks.findMany({
    where: {
      ...(discover ? {} : { fid: fid }),
      ...(search
        ? {
            text: {
              contains: search,
            },
          }
        : {
            category_id: categoryId ? categoryId : undefined,
          }),
    },
    select: {
      bookmark_id: true,
      hash: true,
    },
    take: 10,
  });

  const castsHashes = await getCasts(casts.map((cast) => cast.hash));
  const castDetails: any = [];

  for (let i = 0; i < castsHashes.length; i++) {
    castDetails.push({ ...castsHashes[i], ...casts[i] });
  }

  return { categories, casts: castDetails };
};

const deleteBookmark = async ({ bookmark_id }: { bookmark_id: string }) => {
  "use server";
  await prisma.bookmarks.delete({
    where: {
      bookmark_id,
    },
  });
};

export async function Home({
  categoryId,
  search,
  discover = false,
}: {
  categoryId?: string;
  search?: string;
  discover?: boolean;
}) {
  const verifiedClaims = await getVerifiedClaims();

  const user = await privy.getUser(verifiedClaims.userId);

  const { categories, casts } = await getCategories({
    fid: String(user.farcaster?.fid),
    categoryId,
    search,
    discover,
  });

  if (!user.farcaster) redirect("/signin?redirect_to=/");

  return (
    <main className="flex flex-1 flex-col md:w-[690px]">
      {search ? null : (
        <>
          <Category list={categories} />
        </>
      )}

      {categories.length === 0 && (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-xl text-gray-700">No categories found!</div>
        </div>
      )}

      {casts.map((cast: any) => (
        <Cast
          key={cast.bookmark_id}
          hash={cast.hash}
          bookmark_id={cast.bookmark_id}
          reactions={{
            likes: cast.reactions.likes_count,
            replies: cast.reactions.recasts_count,
            recasts: cast.reactions.replies_count,
          }}
          text={cast.text ?? ""}
          timestamp={String(cast.timestamp)}
          author={cast.author}
          embeds={cast.embeds}
          deleteBookmark={deleteBookmark}
        />
      ))}

      {casts.length === 0 && (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-xl text-gray-600">No casts found!</div>
        </div>
      )}
    </main>
  );
}

export default function CategoryFeed(props: {
  params: { categoryId: string };
  searchParams: { discover: string };
}) {
  return (
    <Suspense fallback={HomeLoading}>
      <Home
        categoryId={props.params.categoryId}
        discover={props?.searchParams?.discover === "view" ? true : false}
      />
    </Suspense>
  );
}
