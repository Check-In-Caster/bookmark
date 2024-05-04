import Cast from "@/components/app/Cast";
import Category from "@/components/app/Category";
import HomeLoading from "@/components/layout/home-loading";
import { AllowedFids } from "@/config";
import { getCasts } from "@/lib/neynar";
import { prisma } from "@/lib/prisma";
import { getVerifiedClaims, privy } from "@/lib/privy";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const getCategories = async ({
  fid,
  categoryId,
  search,
}: {
  fid: string;
  categoryId?: string;
  search?: string;
}) => {
  const categories = await prisma.categories.findMany({
    where: {
      fid: fid,
    },
  });

  const casts = await prisma.bookmarks.findMany({
    where: {
      fid: fid,
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
    take: 10,
  });

  const castsHashes = await getCasts(casts.map((cast) => cast.hash));

  return { categories, casts: castsHashes };
};

export async function Home({
  categoryId,
  search,
}: {
  categoryId?: string;
  search?: string;
}) {
  const verifiedClaims = await getVerifiedClaims();

  const user = await privy.getUser(verifiedClaims.userId);

  const { categories, casts } = await getCategories({
    fid: String(user.farcaster?.fid),
    categoryId,
    search,
  });

  if (!user.farcaster) redirect("/signin?redirect_to=/");

  if (!AllowedFids.includes(user.farcaster.fid)) {
    return "Permission Denied!";
  }

  return (
    <main className="flex flex-1 flex-col md:w-[690px]">
      {search ? null : <Category list={categories} />}

      {categories.length === 0 && (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-xl text-gray-700">No categories found!</div>
        </div>
      )}

      {casts.map((cast: any) => (
        <Cast
          key={cast.bookmark_id}
          hash={cast.hash}
          reactions={{
            likes: cast.reactions.likes_count,
            replies: cast.reactions.recasts_count,
            recasts: cast.reactions.replies_count,
          }}
          text={cast.text ?? ""}
          timestamp={String(cast.timestamp)}
          author={cast.author}
          embeds={cast.embeds}
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
}) {
  return (
    <Suspense fallback={HomeLoading}>
      <Home categoryId={props.params.categoryId} />
    </Suspense>
  );
}
