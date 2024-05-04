import { ImageLazy } from "@/components/ui/image-lazy";

const Embed: React.FC<{ url: string }> = ({ url }) => {
  if (
    (url && url.match(/\.(jpeg|jpg|gif|png|avif|webp)$/) != null) ||
    url?.includes("googleusercontent") ||
    url?.includes("imagedelivery.net")
  ) {
    return (
      <>
        <ImageLazy
          src={url}
          height={300}
          width={300}
          alt="embed"
          className="mt-3 h-80 w-full rounded-sm object-cover"
        />
      </>
    );
  }

  if (
    (url && url.match(/\.(mp4)$/) != null) ||
    url?.includes("googleusercontent")
  ) {
    return (
      <>
        <video
          controls
          playsInline
          className="mt-3 h-80 w-full rounded-sm object-cover"
        >
          <source src={url} type="video/mp4" />
        </video>
      </>
    );
  }

  return null;
};

export default Embed;
