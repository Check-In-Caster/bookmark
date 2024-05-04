import { PrivyLogoutBtn } from "@/components/privy";

import { getVerifiedClaims, privy } from "@/lib/privy";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const verifiedClaims = await getVerifiedClaims();
  const user = await privy.getUser(verifiedClaims.userId);
  if (!user.farcaster) redirect("/signin?redirect_to=/profile");

  return (
    <main className="flex flex-1 flex-col">
      <p>Profile!</p>

      <div className="px-12 pb-10">
        <PrivyLogoutBtn
          className="w-full bg-red-500 px-6 py-3 hover:bg-red-700"
          redirectToHome
        />
      </div>
    </main>
  );
}
