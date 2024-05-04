import { fetchQuery, init } from "@airstack/node";

init(process.env.AIRSTACK_API_KEY!);

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

export { getFidsFromUsername, getUserInfo };
