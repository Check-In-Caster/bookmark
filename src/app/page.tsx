import HomeLoading from "@/components/layout/home-loading";
import { Suspense } from "react";
import { Home } from "./category/[categoryId]/page";

export default function HomePage() {
  return (
    <Suspense fallback={HomeLoading}>
      <Home />
    </Suspense>
  );
}
