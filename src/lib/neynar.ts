const axios = require("axios");

export const replyCast = async ({
  textContents = `Bookmarked!`,
  embedUrl,
  parentId,
}: {
  textContents?: string;
  embedUrl: string;
  parentId: string;
}) => {
  try {
    const options = {
      method: "POST",
      url: "https://api.neynar.com/v2/farcaster/cast",
      headers: {
        accept: "application/json",
        api_key: process.env.NEYNAR_API_KEY,
        "content-type": "application/json",
      },
      data: {
        signer_uuid: process.env.NEYNAR_SIGNED_UUID,
        text: textContents,
        embeds: [{ url: embedUrl }],
        parent: parentId,
      },
    };

    const response = await axios.request(options);

    console.log(response);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getCastInfo = async ({
  hash,
  type = "url",
}: {
  hash: string;
  type?: string;
}) => {
  try {
    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/cast/conversation?identifier=${hash}&type=${type}&reply_depth=2`,
      {
        cache: "no-store",
        method: "GET",
        headers: {
          accept: "application/json",
          api_key: process.env.NEYNAR_API_KEY!,
        },
      },
    );

    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    // throw new Error("Failed to fetch data");
  }
};

export const getCasts = async (casts: string[], viewerFid = 3) => {
  if (casts.length === 0) return [];

  const url = `https://api.neynar.com/v2/farcaster/casts?casts=${casts.join(",")}&viewer_fid=${viewerFid}`;
  const headers = {
    accept: "application/json",
    api_key: process.env.NEYNAR_API!,
  };

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    return data.result.casts;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const fetchUserData = async (fids: string[]) => {
  const viewerFid = 3;

  const url = `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fids.join(",")}&viewer_fid=${viewerFid}`;
  const headers = {
    accept: "application/json",
    api_key: process.env.NEYNAR_API!,
  };

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();

    const user = {};

    for (const fid of data.users) {
      // @ts-ignore
      if (!user[fid.fid]) {
        // @ts-ignore
        user[fid.fid] = fid;
      }
    }

    return user;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
