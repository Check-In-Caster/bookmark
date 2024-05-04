import HomeLoading from "@/components/layout/home-loading";
import { AllowedFids } from "@/config";
import { getVerifiedClaims, privy } from "@/lib/privy";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function Home() {
  const verifiedClaims = await getVerifiedClaims();

  const user = await privy.getUser(verifiedClaims.userId);
  if (!user.farcaster) redirect("/signin?redirect_to=/");

  if (!AllowedFids.includes(user.farcaster.fid)) {
    return "Permission Denied!";
  }

  return (
    <main className="flex flex-1 flex-col">
      <Link passHref href="/internal/badge" className="border-b p-5">
        List Bookmarks
      </Link>
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={HomeLoading}>
      <Home />
    </Suspense>
  );
}
