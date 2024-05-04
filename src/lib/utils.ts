import { APP_URL } from "@/app/env";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const extractUrls = (text: string) => {
  try {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = text.match(urlRegex);
    return urls || [];
  } catch (e) {
    console.log(e);
    return [];
  }
};

export function postUrl(params: { param: string }): string {
  const baseUrl = `${APP_URL}/frames/bookmark`;
  const urlParams = new URLSearchParams();
  urlParams.append("type", params.param);
  return `${baseUrl}?${urlParams.toString()}`;
}
