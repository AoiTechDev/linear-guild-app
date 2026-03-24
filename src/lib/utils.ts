import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { BLIZZARD_HOST_NAME } from "@/constants/blizzard-host-name";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const params = new URLSearchParams({
  namespace: "profile-eu",
  locale: "en_GB",
});

export function constructFetchRequest({
  path,
  token,
}: {
  path: string;
  token: string;
}): {
  input: string | URL | Request;
  init?: RequestInit;
} {
  const createPath = `${BLIZZARD_HOST_NAME}${path}?${params}`;

  return {
    input: createPath,
    init: {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  };
}
