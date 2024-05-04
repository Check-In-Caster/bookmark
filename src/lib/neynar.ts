const axios = require("axios");

export const replyCast = async ({
  textContents = `Woohoo! Great check-in! ✅
You just earned 10 $CHECK points!`,
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
