import { NextRequest } from 'next/server';
import { frames } from '../../frames';
import { APP_URL } from '../../../env';

type ActionMetadata = {
  /** The action name. Must be less than 30 characters. */
  name: string;
  /** An [Octicons](https://primer.style/foundations/icons) icon name. */
  icon: string;
  /** A short description up to 80 characters. */
  description: string;
  /** External link to an "about" page for extended description. */
  aboutUrl: string;
  /** The action type. (Same type options as frame buttons). Only post is accepted in V1. */
  action: {
    type: 'post';
  };
};

export const GET = (req: NextRequest) => {
  const actionMetadata: ActionMetadata = {
    name: 'Bookmark',
    icon: 'bookmark',
    description: 'Bookmark any cast and view it from our client',
    aboutUrl: `${APP_URL}/frames/bookmark`,
    action: {
      type: 'post',
    },
  };

  return Response.json(actionMetadata);
};

export const POST = frames(async (ctx) => {
  return Response.json({
    type: 'frame',
    frameUrl: `${APP_URL}/frames/bookmark`,
  });
});

// export const POST = (req: NextRequest) => {

//   return Response.json(
//     {
//       message: '🪄 Cast Bookmarked',
//     },
//     { status: 200 }
//   );
// };
