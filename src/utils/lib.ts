import { BLIZZARD_HOST_NAME } from "@/constants/blizzard-host-name";

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
