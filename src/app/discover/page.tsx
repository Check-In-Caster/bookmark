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

  const userInfo = await fetchUserData(
    categories.map((category) => category.fid),
  );

  return { categories, userInfo };
};

const DiscoverCard = ({ data, users }: { data: Categories; users?: any }) => {
  return (
    <Link
      href={`/category/${data.category_id}`}
      passHref
      className="flex items-center border-b px-4 py-2"
    >
      <img
        src="/assets/icons/discover_avatar.png"
        className="h-14 w-14"
        alt="Discover Avatar"
      />
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
  const { categories, userInfo } = await getDiscoverData();
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
        />
      ))}
    </div>
  );
};

export default Discover;
