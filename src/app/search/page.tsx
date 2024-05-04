import HomeLoading from "@/components/layout/home-loading";
import { Suspense } from "react";
import { Home } from "../category/[categoryId]/page";

export default function HomePage(props: any) {
  return (
    <Suspense fallback={HomeLoading}>
      <Home search={props.searchParams.q} />
    </Suspense>
  );
}
