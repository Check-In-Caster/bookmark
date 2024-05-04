"use server";

import { getFidFromToken } from "@/lib/privy";

export default async function mintBadge(prevState: any, formData: FormData) {
  const userFid = await getFidFromToken();

  return "success";
}
