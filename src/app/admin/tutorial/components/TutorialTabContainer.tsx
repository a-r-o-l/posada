import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { TabsContent } from "@/components/ui/tabs";
import Image from "next/image";
import React from "react";

function TutorialTabContainer({
  data,
  value,
}: {
  data: {
    id: number;
    name: string;
    image: string;
  }[];
  value: string;
}) {
  return (
    <TabsContent value={value}>
      <div className="w-full h-[calc(100vh-500px)]">
        <Carousel className="w-full h-full">
          <CarouselContent>
            {data.map(
              (
                school: {
                  id: number;
                  name: string;
                  image: string;
                },
                index: number
              ) => (
                <CarouselItem key={school.id}>
                  <div>
                    <div className="flex w-full justify-center py-5">
                      <Badge
                        className="text-lg font-black"
                        variant="destructive"
                      >
                        {index + 1} / {data.length}
                      </Badge>
                    </div>
                    <div className="flex justify-center items-start w-full h-full p-4">
                      <Card className="w-[60%]">
                        <CardContent className="p-0 w-full h-full">
                          <Image
                            src={school.image}
                            alt={school.name}
                            width={1920}
                            height={1080}
                            className="w-full h-full object-contain"
                            priority
                            quality={100}
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CarouselItem>
              )
            )}
          </CarouselContent>
          <CarouselPrevious className="left-2 w-12 h-12" variant="default" />
          <CarouselNext className="right-2 w-12 h-12" variant="default" />
        </Carousel>
      </div>
    </TabsContent>
  );
}

export default TutorialTabContainer;
