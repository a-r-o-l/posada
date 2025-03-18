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
import React, { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";

function SchoolsCarrousel({
  images,
}: {
  images: { id: number; src: string }[];
}) {
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
    Autoplay({
      delay: 0,
      stopOnInteraction: false,
      playOnInit: true,
      stopOnMouseEnter: false,
      stopOnFocusIn: false,
    })
  );
  return (
    <div className="flex rounded-xl shadow-xl border-2 mt-10 w-full flex-col">
      <div className="flex w-full">
        <Carousel
          className="w-full relative shadow-none border-4 border-[#AC292F] rounded-xl outline-none"
          plugins={[plugin.current]}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          setApi={setApi}
          opts={{
            align: "center",
            loop: true,
            dragFree: true,
            skipSnaps: true,
            inViewThreshold: 1,
            containScroll: "keepSnaps",
            slidesToScroll: 1,
            duration: 2500,
          }}
        >
          <CarouselContent className="-ml-2 md:-ml-4 shadow-none border-0">
            {images.map((image) => (
              <CarouselItem key={image.id} className="pl-2 basis-1/3 mx-2">
                <Image
                  src={image.src}
                  alt={`Gallery Image ${image.id + 1}`}
                  width={200}
                  height={200}
                  className="object-contain w-[180px] h-[180px]"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 w-12 h-12 bg-[#AC292F] hover:bg-[#AC292F] hover:text-white text-white" />
          <CarouselNext className="right-2 w-12 h-12 bg-[#AC292F] hover:bg-[#AC292F] hover:text-white text-white" />
        </Carousel>
      </div>
    </div>
  );
}

export default SchoolsCarrousel;
