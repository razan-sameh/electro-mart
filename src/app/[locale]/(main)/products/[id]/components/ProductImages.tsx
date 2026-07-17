import Image from "next/image";
import { typProductImage } from "@/content/types";

interface Props {
  images: typProductImage[];
  name: string;
}

export default function ProductImages({ images, name }: Props) {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Warm up the connection + start fetching the LCP image immediately */}
      {images[0] && (
        <>
          <link
            rel="preconnect"
            href="https://vmcypnenslolrpkhzkrm.supabase.co"
            crossOrigin=""
          />
          <link
            rel="preload"
            as="image"
            href={images[0].url}
            fetchPriority="high"
          />
        </>
      )}

      <div className="w-full flex justify-center relative main-image-stage">
        {images.map((img, i) => (
          <div key={i} className="contents">
            <input
              aria-label={`Select image ${i + 1}`}
              type="radio"
              name="product-image"
              id={`img-${i}`}
              defaultChecked={i === 0}
              className="hidden-radio peer"
            />
            <div className="main-image-slide w-full max-w-md h-64 sm:h-80 md:h-96 lg:h-[28rem] peer-checked:main-image-active">
              <Image
                src={img.url}
                alt={name}
                fill
                priority={i === 0}
                fetchPriority="high"
                unoptimized={i === 0}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain"
              />
            </div>
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 justify-center flex-wrap">
          {images.map((img, i) => (
            <label key={i} htmlFor={`img-${i}`} className="thumb-label">
              <Image
                src={img.url}
                alt={`${name} ${i}`}
                width={100}
                height={80}
                loading="lazy"
                className="rounded-md border cursor-pointer hover:scale-105 transition object-cover thumb-img"
              />
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
