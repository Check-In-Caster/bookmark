import Category from "@/components/app/Category";
import HomeLoading from "@/components/layout/home-loading";
import { AllowedFids } from "@/config";
import { prisma } from "@/lib/prisma";
import { getVerifiedClaims, privy } from "@/lib/privy";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const getCategories = async ({ fid }: { fid: string }) => {
  const categories = await prisma.categories.findMany({
    where: {
      fid: fid,
    },
  });

  return categories;
};

async function Home() {
  const verifiedClaims = await getVerifiedClaims();

  const user = await privy.getUser(verifiedClaims.userId);

  const categories = await getCategories({ fid: String(user.farcaster?.fid) });

  if (!user.farcaster) redirect("/signin?redirect_to=/");

  if (!AllowedFids.includes(user.farcaster.fid)) {
    return "Permission Denied!";
  }

  return (
    <main className="flex flex-1 flex-col">
      <Category list={categories} />

      {categories.length === 0 && (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-xl text-gray-700">No categories found!</div>
        </div>
      )}
    </main>
  );
}

export default function CategoryFeed() {
  return (
    <Suspense fallback={HomeLoading}>
      <Home />
    </Suspense>
  );
}
