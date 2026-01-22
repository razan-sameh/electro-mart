"use client";

import { typProductImage } from "@/content/types";
import { useState } from "react";

interface Props {
  images: typProductImage[];
  name: string;
}

export default function ProductImages({ images, name }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Main Image - centered with fixed responsive size */}
      <div className="w-full flex justify-center">
        <div className="w-full max-w-md h-64 sm:h-80 md:h-96 lg:h-[28rem] rounded-lg  overflow-hidden">
          <img 
            src={images[selectedImage].url} 
            alt={name} 
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      
      {/* Thumbnail Images - centered as a group */}
      {images.length > 1 && (
        <div className="flex gap-2 justify-center flex-wrap">
          {images.map((img, i) => (
            <img
              key={i}
              src={img.url}
              alt={`${name} ${i}`}
              width={100}
              height={80}
              className={`rounded-md border cursor-pointer hover:scale-105 transition object-cover ${
                selectedImage === i 
                  ? 'border-primary border-2' 
                  : 'border-lightGray'
              }`}
              onClick={() => setSelectedImage(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}