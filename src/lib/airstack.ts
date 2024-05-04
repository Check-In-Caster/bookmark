import { fetchQuery, init } from "@airstack/node";

init(process.env.AIRSTACK_API_KEY!);

const getPoapBadges = async (fid: string) => {
  const { data, error } = await fetchQuery(
    `query USER_POAP_COUNTRY($owner: Identity = "fc_fid:${fid}") {
              Poaps(input: {filter: {owner: {_eq: $owner}}, order:{ createdAtBlockNumber: DESC},blockchain: ALL}) {
                Poap {
                  eventId 
                  poapEvent {
                    eventName
                    description
                    metadata 
                    isVirtualEvent
                    city
                    country
                  }
                }
              }
            }`,
  );

  if (!data.Poaps.Poap) return [];

  const poapData = [];

  for (const poap of data.Poaps.Poap) {
    if (poap.poapEvent.isVirtualEvent === false) {
      poapData.push({
        eventId: poap.eventId,
        eventName: poap.poapEvent.eventName,
        description: poap.poapEvent.description,
        image_url: poap.poapEvent.metadata.image_url,
        country: poap.poapEvent.country,
        city: poap.poapEvent.city,
        eventStartDate: poap.poapEvent.metadata.attributes[0].value,
      });
    }
  }

  return poapData;
};

const getUserInfo = async (fid: string) => {
  init(process.env.AIRSTACK_API_KEY!);

  const { data, error } = await fetchQuery(
    `query MyQuery {
      Socials(
        input: {filter: {userId: {_eq: "${fid}"}, dappName: {_eq: farcaster}}, blockchain: ethereum}
      ) {
        Social {
          dappName
          userId
          userAddress
          userCreatedAtBlockTimestamp
          userCreatedAtBlockNumber
          userHomeURL
          followerCount
          followingCount
          userRecoveryAddress
          userAssociatedAddresses
          profileBio
          profileDisplayName
          profileImage
          profileUrl
          profileName
          profileCreatedAtBlockTimestamp
          profileCreatedAtBlockNumber
          fnames
        }
      }
    }`,
  );

  return data.Socials?.Social[0] || null;
};

const getFidsFromUsername = async (usernames: string[]) => {
  const { data, error } = await fetchQuery(
    `query MyQuery($username: [Identity!] ) {
      Socials(
        input: {filter: {identity: {_in: $username}, dappName: {_eq: farcaster}}, blockchain: ethereum}
      ) {
        Social {
          dappName
          userId
          profileDisplayName
          fnames
          connectedAddresses {
            address
            chainId
            blockchain
            timestamp
          }
        }
      }
    }`,
    {
      username: usernames.map((username) => `fc_fname:${username}`),
    },
  );

  return data.Socials?.Social || [];
};

const getCastsReactions = async (hash: (string | null)[]) => {
  const { data, error } = await fetchQuery(
    `query MyQuery($hash: [String!]) {
      FarcasterCasts(
        input: {blockchain: ALL, filter: {hash: {_in: $hash}}}
      ) {
        Cast{
          hash
          numberOfRecasts
          numberOfLikes
          numberOfReplies
        }
      }
    }`,
    {
      hash: hash,
    },
  );

  if (data.FarcasterCasts?.Cast) {
    let formatResults: Record<
      string,
      {
        numberOfRecasts: number;
        numberOfLikes: number;
        numberOfReplies: number;
      }
    > = {};

    for (const cast of data.FarcasterCasts?.Cast) {
      formatResults[cast.hash] = {
        numberOfRecasts: cast.numberOfRecasts,
        numberOfLikes: cast.numberOfLikes,
        numberOfReplies: cast.numberOfReplies,
      };
    }

    return formatResults;
  }

  return data.FarcasterCasts?.Cast || [];
};

const getChannelsData = async (
  channels: string[],
): Promise<Map<string, any> | null> => {
  const { data, error } = await fetchQuery(
    `query MyQuery {
      FarcasterChannels(
        input: {
          blockchain: ALL,
          filter: {
            channelId: {_in: ${JSON.stringify(channels)}}
          }
        }
      ) {
        FarcasterChannel {
          channelId
          name
          url
          imageUrl
        }
      }
    }`,
  );

  if (!data) return null;
  if (!data.FarcasterChannels) return null;
  if (!data.FarcasterChannels.FarcasterChannel) return null;
  if (data.FarcasterChannels.FarcasterChannel.length === 0) return null;

  return new Map(
    data.FarcasterChannels.FarcasterChannel.map((channel: any) => [
      channel.channelId,
      channel,
    ]),
  );
};

const getChannelsOfUserFromFid = async (fid: string): Promise<string[]> => {
  const { data, error } = await fetchQuery(
    `query MyQuery {
      FarcasterChannelParticipants(
        input: {
          filter: {
            participant: {_eq: "fc_fid:${fid}"} 
          },
          blockchain: ALL
        }
      ) {
        FarcasterChannelParticipant {
          channelId
        }
      }
    }`,
  );

  if (!data) return [];
  if (!data.FarcasterChannelParticipants) return [];
  if (!data.FarcasterChannelParticipants.FarcasterChannelParticipant) return [];
  if (
    data.FarcasterChannelParticipants.FarcasterChannelParticipant.length === 0
  )
    return [];

  return data.FarcasterChannelParticipants.FarcasterChannelParticipant.map(
    (channel: any) => channel.channelId as string,
  );
};

export {
  getCastsReactions,
  getChannelsData,
  getChannelsOfUserFromFid,
  getFidsFromUsername,
  getPoapBadges,
  getUserInfo,
};
