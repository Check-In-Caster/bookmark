"use client";

import { Categories } from "@prisma/client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Category = ({ list }: { list: Categories[] }) => {
  const path = usePathname();

  return (
    <div className="my-4 flex  items-center space-x-4 overflow-scroll px-5 py-4 capitalize">
      <Link
        href={`/`}
        passHref
        className={`min-w grid h-[34px] w-[100px] place-items-center rounded-lg border px-5 py-1 text-center text-[14px] font-medium ${path === "/" ? " border-b border-gray-900 bg-gray-900 text-white" : "text-gray-900"}`}
      >
        <div>All</div>
      </Link>

      {list.map((category) => (
        <Link
          href={`/category/${category.category_id}`}
          passHref
          className={`min-w grid h-[34px] w-[100px] place-items-center rounded-lg border px-5 py-1 text-center text-[14px] font-medium ${path?.includes(category.category_id) ? " border-b border-gray-900 bg-gray-900 text-white" : "text-gray-900"}`}
          key={category.category}
        >
          <div>{category.category}</div>
        </Link>
      ))}
    </div>
  );
};

export default Category;
