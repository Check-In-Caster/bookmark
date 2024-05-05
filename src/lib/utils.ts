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

export const extractCategory = (text: string) => {
  const regex = /(?<=@bookmark\s*).*/;
  const match = text.toLocaleLowerCase().match(regex);

  return match ? match[0].toLowerCase().trim() : null;
};

export const formatCategory = (string: string): string => {
  return string
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export function postUrl(params: { param: string }): string {
  const baseUrl = `${APP_URL}/frames/bookmark`;
  const urlParams = new URLSearchParams();
  urlParams.append("type", params.param);
  return `${baseUrl}?${urlParams.toString()}`;
}
