"use client";

import { Categories } from "@prisma/client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Category = ({ list }: { list: Categories[] }) => {
  const path = usePathname();

  return (
    <div className="flex items-center justify-between space-x-14 overflow-scroll border-b px-5 py-4 uppercase">
      {list.map((category) => (
        <Link
          href={`/category/${category.category_id}`}
          passHref
          className={`min-w  text-[20px] ${path?.includes(category.category_id) ? " border-b border-gray-900" : "text-gray-500"}`}
          key={category.category}
        >
          <div>{category.category}</div>
        </Link>
      ))}
    </div>
  );
};

export default Category;
