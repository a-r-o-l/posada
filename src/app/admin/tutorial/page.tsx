import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Folder, Images, School, Truck } from "lucide-react";
import React from "react";
import TutorialTabContainer from "./components/TutorialTabContainer";

const schooldata = [
  {
    id: 1,
    name: "foto 1",
    image: "/ui/tutorial/tutorial1.png",
  },
  {
    id: 2,
    name: "foto 2",
    image: "/ui/tutorial/tutorial2.png",
  },
  {
    id: 3,
    name: "foto 3",
    image: "/ui/tutorial/tutorial3.png",
  },
];

const productsdata = [
  {
    id: 1,
    name: "foto 1",
    image: "/ui/tutorial/tutorial4.png",
  },
  {
    id: 2,
    name: "foto 2",
    image: "/ui/tutorial/tutorial5.png",
  },
];
const foldersdata = [
  {
    id: 1,
    name: "foto 1",
    image: "/ui/tutorial/tutorial6.png",
  },
  {
    id: 2,
    name: "foto 2",
    image: "/ui/tutorial/tutorial7.png",
  },
  {
    id: 3,
    name: "foto 2",
    image: "/ui/tutorial/tutorial8.png",
  },
  {
    id: 4,
    name: "foto 2",
    image: "/ui/tutorial/tutorial9.png",
  },
  {
    id: 5,
    name: "foto 2",
    image: "/ui/tutorial/tutorial10.png",
  },
];

const orderdata = [
  {
    id: 1,
    name: "foto 1",
    image: "/ui/tutorial/tutorial11.png",
  },
  {
    id: 2,
    name: "foto 2",
    image: "/ui/tutorial/tutorial12.png",
  },
];

export default async function page() {
  return (
    <div className="p-4 w-full mx-auto container flex flex-col gap-5">
      <Tabs defaultValue="schools" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="schools">
            <School className="mr-2 h-4 w-4" />
            Colegios
          </TabsTrigger>
          <TabsTrigger value="products">
            <Images className="mr-2 h-4 w-4" />
            Productos
          </TabsTrigger>
          <TabsTrigger value="folders">
            <Folder className="mr-2 h-4 w-4" />
            Carpetas
          </TabsTrigger>
          <TabsTrigger value="order">
            <Truck className="mr-2 h-4 w-4" />
            Pedidos
          </TabsTrigger>
        </TabsList>
        <TutorialTabContainer data={schooldata} value="schools" />
        <TutorialTabContainer data={productsdata} value="products" />
        <TutorialTabContainer data={foldersdata} value="folders" />
        <TutorialTabContainer data={orderdata} value="order" />
      </Tabs>
    </div>
  );
}
