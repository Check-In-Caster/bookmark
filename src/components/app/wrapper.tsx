"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";

const CastWrapper: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children,
}) => {
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="grid cursor-pointer grid-flow-row grid-cols-[repeat(14,minmax(0,1fr))] border-b bg-purple-50 bg-opacity-20 px-4 py-5"
      ref={wrapperRef}
      onClick={(e) => {
        if (!wrapperRef.current) return;

        const allIgnoredElements = Array.from(
          wrapperRef.current.querySelectorAll(
            "a, button, li, img, video, .metadata",
          ),
        );
        for (const el of allIgnoredElements) {
          if (el.contains(e.target as Node)) return;
        }

        router.push(href);
      }}
    >
      {children}
    </div>
  );
};

export default CastWrapper;
