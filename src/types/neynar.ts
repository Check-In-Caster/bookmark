export type NeynarManyCastsResponse = {
  result: {
    casts: [
      {
        object: "cast";
        hash: string;
        thread_hash: string;
        parent_hash: string | null;
        parent_url: string | null;
        root_parent_url: string | null;
        parent_author: {
          fid: string | null;
        };
        author: {
          object: "user";
          fid: number;
          custody_address: string;
          username: string;
          display_name: string;
          pfp_url: string;
          profile: {
            bio: {
              text: string;
              mentioned_profiles: [];
            };
          };
          follower_count: number;
          following_count: number;
          verifications: [string];
          verified_addresses: {
            eth_addresses: [string];
            sol_addresses: [];
          };
          active_status: string;
          power_badge: true;
        };
        text: string;
        timestamp: string;
        embeds: [
          | {
              url: string;
            }
          | { hash: string },
        ];
        reactions: {
          likes: {
            fid: number;
            fname: string;
          }[];
          recasts: {
            fid: number;
            fname: string;
          }[];
        };
        replies: {
          count: number;
        };
        mentioned_profiles: [number];
        viewer_context: {
          liked: boolean;
          recasted: boolean;
        };
      },
    ];
  };
};

export type NeynarCastData = NeynarManyCastsResponse["result"]["casts"][0];
