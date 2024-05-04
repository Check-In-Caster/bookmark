"use client";

import { Toaster } from "@/components/ui/sonner";
import { usePathname } from "next/navigation";
import Footer from "./footer";
import Header from "./header";

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const hideHeaderFooter =
    pathname === "/cast/new" || pathname === "/auth/password";

  return (
    <div className="relative mx-auto flex min-h-[100svh] w-full max-w-5xl flex-col ">
      <Header hide={hideHeaderFooter} />
      {/* Modify div padding and min-height if height of header or footer changes */}
      <div
        className={`flex min-h-[100svh] flex-col ${
          !hideHeaderFooter ? "pb-[57px] pt-[66.08px]" : ""
        }`}
      >
        <div
          id="app-layout"
          className="min-w-2xl flex flex-1 flex-col md:mx-auto"
        >
          {children}
        </div>
      </div>
      <Footer hide={hideHeaderFooter} />
      <Toaster position="top-center" />
    </div>
  );
};

export default AppLayout;
