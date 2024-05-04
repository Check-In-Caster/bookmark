"use server";

export async function checkPassword(password: string) {
  if (password === process.env.PREVIEW_PASSWORD) {
    return true;
  }
  return false;
}
