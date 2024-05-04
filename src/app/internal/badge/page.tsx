import { getVerifiedClaims, privy } from "@/lib/privy";
import { redirect } from "next/navigation";

const Page = async () => {
  const verifiedClaims = await getVerifiedClaims();

  const user = await privy.getUser(verifiedClaims.userId);
  if (!user.farcaster) redirect("/signin?redirect_to=/");

  return <p>Page</p>;
};

export default Page;
