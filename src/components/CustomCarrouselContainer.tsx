"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import Autoplay from "embla-carousel-autoplay";

function CustomCarrouselContainer() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }
    const onSelect = () => {
      setCurrentIndex(api.selectedScrollSnap());
    };
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const plugin = React.useRef(
    Autoplay({ delay: 2500, stopOnInteraction: false })
  );
  const images = useMemo(() => {
    const imgs = Array.from({ length: 10 }).map((_, index) => {
      return {
        id: index,
        src: `https://picsum.photos/200/300?random=${index}`,
        title: `Gallery Image ${index}`,
        text: `This is the description of the gallery image ${index}`,
      };
    });
    return imgs;
  }, []);

  return (
    <div className="flex rounded-xl shadow-xl border-2 mt-10 max-w-7xl flex-col md:flex-row">
      <div className="flex w-full">
        <Carousel
          className="w-full relative"
          plugins={[plugin.current]}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          setApi={setApi}
          onChange={(e) => console.log(e)}
        >
          <CarouselContent>
            {images.map((image) => (
              <CarouselItem key={image.id}>
                <Image
                  src={image.src}
                  alt={`Gallery Image ${image.id + 1}`}
                  width={400}
                  height={600}
                  className="object-cover w-full h-[400px]"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </div>
      <div className="flex flex-col justify-center items-center p-4 h-[400px] w-full bg-sky-200 dark:bg-black backdrop-blur-sm bg-opacity-50">
        <h2 className="text-2xl font-bold mb-2">
          {images[currentIndex].title}
        </h2>
        <p className="text-lg mb-4">{images[currentIndex].text}</p>
      </div>
    </div>
  );
}

export default CustomCarrouselContainer;
