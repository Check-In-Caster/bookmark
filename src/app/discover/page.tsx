import { fetchUserData } from "@/lib/neynar";
import { prisma } from "@/lib/prisma";
import { Categories } from "@prisma/client";
import Link from "next/link";

const getDiscoverData = async () => {
  const categories = await prisma.categories.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    take: 10,
  });

  const categoryFidMapping: any = {};
  const fidToFetch = [];

  for (const category of categories) {
    const casts = await prisma.bookmarks.findMany({
      select: {
        fid: true,
      },
      where: {
        category_id: category.category_id,
      },
      distinct: ["fid"],
      take: 4,
    });
    fidToFetch.push(...casts.map((cast) => cast.fid));
    categoryFidMapping[category.category_id] = casts;
  }

  const userInfo = await fetchUserData([
    ...categories.map((category) => category.fid),
    ...fidToFetch,
  ]);

  return { categories, userInfo, categoryFidMapping };
};

const DiscoverCard = ({
  data,
  users,
  categoryFidMapping,
}: {
  data: Categories;
  users?: any;
  categoryFidMapping?: string[];
}) => {
  // @ts-ignore
  if (categoryFidMapping?.[data?.category_id].length === 0) return null;

  return (
    <Link
      href={`/category/${data.category_id}?discover=view`}
      passHref
      className="flex items-center border-b px-4 py-2"
    >
      <div className="grid grid-cols-2 gap-0 object-cover">
        {/* @ts-ignore */}
        {categoryFidMapping?.[data?.category_id]?.map((fid) => (
          <>
            <img
              key={fid.fid}
              src={users[fid.fid]?.pfp_url}
              className="h-10 w-10"
            />
            <img
              key={fid.fid}
              src={users[fid.fid]?.pfp_url}
              className="h-10 w-10"
            />
            <img
              key={fid.fid}
              src={users[fid.fid]?.pfp_url}
              className="h-10 w-10"
            />
            <img
              key={fid.fid}
              src={users[fid.fid]?.pfp_url}
              className="h-10 w-10"
            />
          </>
        ))}
      </div>

      <div className="ml-4">
        <p className="text-xl capitalize">{data.category}</p>
        <p className="mt-4 flex items-center space-x-4 text-gray-500">
          by
          <img
            src={users[data?.fid]?.pfp_url}
            className="mx-2 h-8 w-8 rounded-full"
          />
          {users[data?.fid]?.display_name}
        </p>
      </div>
    </Link>
  );
};

const Discover = async () => {
  const { categories, userInfo, categoryFidMapping } = await getDiscoverData();
  return (
    <div className="w-full md:min-w-[500px]">
      <h2 className="px-4 py-4 text-xl  font-medium md:py-8">
        Discover Bookmarks
      </h2>

      {categories.map((category) => (
        <DiscoverCard
          key={category.category_id}
          data={category}
          users={userInfo}
          categoryFidMapping={categoryFidMapping}
        />
      ))}
    </div>
  );
};

export default Discover;
