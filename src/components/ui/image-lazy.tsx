"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

const ImageLazy: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({
  src,
  className,
  width = 100,
  height = 100,
  ...props
}) => {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (img) {
      img.setAttribute("src", img.getAttribute("data-src") || "");
      img.onload = () => {
        img.removeAttribute("data-src");
        img.classList.remove("blur-md");
      };
    }
  }, []);

  return (
    // eslint-disable-next-line
    <img
      src={`https://placehold.co/${width}x${height}`}
      data-src={src}
      ref={imgRef}
      height={height}
      width={width}
      className={cn(`blur-md`, className)}
      loading="lazy"
      {...props}
    />
  );
};

export { ImageLazy };
