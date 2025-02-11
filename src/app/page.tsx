import React from "react";
import CustomCarrouselContainer from "@/components/CustomCarrouselContainer";
import HomeFormContact from "@/components/HomeFormContact";
import {
  BadgeCheck,
  Ban,
  CreditCard,
  HeartHandshake,
  Send,
  ShoppingCart,
  User,
  Zap,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Stepper from "@/components/Stepper";
import Link from "next/link";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { ThemeButton } from "@/components/ThemeButton";
import LandingHeader from "@/components/LandingHeader";

const featuresSectionContent = [
  {
    id: 3,
    icon: <BadgeCheck size={64} />,
    title: "Calidad superior",
    description: `Posada, con su amplia gama de productos personalizados, suscribe
              al 100 % el modelo de excelencia. Nuestro objetivo es ofrecer
              productos con la mejor relación calidad-precio del mercado. Por
              ello, puedes tener total tranquilidad de que tus imágenes están en
              las mejores manos.`,
  },
  {
    id: 4,
    icon: <Zap size={64} />,
    title: "Envío rápido",
    description: `Gracias a nuestros ajustados plazos de producción, podemos
              ofrecerte un plazo de entrega breve. Por tanto, podrás tener los
              productos personalizados que tanto deseas lo antes posible.`,
  },
  {
    id: 5,
    icon: <Ban size={64} />,
    title: "Sin logo del fabricante",
    description: `No imprimimos nuestro logotipo en nuestros productos
              personalizados. De ese modo, obtendrás un producto 100 % neutral
              con una calidad inigualable para que puedas utilizar la totalidad
              de la superficie imprimible.`,
  },
  {
    id: 6,
    icon: <CreditCard size={64} />,
    title: "Pago seguro",
    description: `Ofrecemos una variedad de opciones de pago seguras para tus
              pedidos.`,
  },
  {
    id: 7,
    icon: <HeartHandshake size={64} />,
    title: "Satisfacción garantizada",
    description: `En Posada, no corres ningún riesgo, ya que nos tomamos muy
              en serio la satisfacción de nuestros clientes. Nuestro objetivo es
              que quedes totalmente satisfecho/a con tu producto. Si, a pesar de
              todo, tuvieras motivos para reclamar, te aseguramos que
              encontraremos una solución satisfactoria y rápida que cumpla tus
              expectativas, ya sea un nuevo envío, cupón o reembolso.`,
  },
];

const randomImages = Array.from({ length: 14 }).map((_, index) => {
  return {
    id: index,
    title: `Gallery Image ${index}`,
    image: `https://picsum.photos/200/300?random=${index + 20}`,
  };
});

const schools = [
  { id: 1, name: "united high school", image: "./s-uhs.jpg" },
  { id: 2, name: "moruli", image: "./s-moruli.jpg" },
  { id: 3, name: "jacaranda", image: "./s-jacaranda.jpg" },
  { id: 4, name: "garcia", image: "./s-garcia.jpg" },
  { id: 5, name: "bds", image: "./s-bds.jpg" },
];

const stepperContent = [
  {
    id: 1,
    title: "ACCEDE",
    description: "Crea tu cuenta de usuario si aún no tienes una.",
    icon: <User size={32} />,
  },
  {
    id: 2,
    title: "HACE TU PEDIDO",
    description:
      "Accede a la tienda y consulta nuestro catálogo. Elige el producto y las fotografías que deseas.",
    icon: <ShoppingCart size={32} />,
  },
  {
    id: 3,
    title: "ABONA",
    description: "Abona con MercadoPago, transferencia o efectivo.",
    icon: <CreditCard size={32} />,
  },
  {
    id: 4,
    title: "PRODUCCIÓN",
    description:
      "El pedido nos llega a nuestro laboratorio y comienza la producción. Podrás ver el estado de tu pedido en todo momento.",
    icon: <Zap size={32} />,
  },
  {
    id: 5,
    title: "RECIBE O RECOGE TU PEDIDO",
    description:
      "Elige entre recoger el pedido en nuestros talleres o recibirlo cómodamente en tu domicilio.",
    icon: <Send size={32} />,
  },
];

function page() {
  return (
    <div className="bg-[url('/123-blue.png')] dark:bg-[url('/123.png')] bg-auto md:bg-cover bg-bottom min-h-screen">
      <LandingHeader />
      <div className="px-10">
        <section className="flex flex-col items-center justify-center mt-32">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r via-purple-400 from-pink-500 to-cyan-500 bg-clip-text text-transparent">
            {/* Productos fotográficos de alta calidad */}
            Productos Fotográficos de Alta Calidad
          </h1>
          <p className="text-2xl font-medium mb-8">
            ¡Únicos, exclusivos y personalizados!
          </p>
          <CustomCarrouselContainer />
        </section>

        <Card className="max-w-4xl mx-auto sm:px-6 lg:px-8 py-8 space-y-8 mt-32 bg-sky-200 dark:bg-black backdrop-blur-sm bg-opacity-50">
          <CardTitle></CardTitle>
          <CardContent>
            <section className="space-y-10">
              <div className="w-full">
                <h1 className="text-2xl font-bold">
                  Posada marca la diferencia
                </h1>
                <p className="text-md mt-2">
                  <span className="italic font-semibold">Posada </span>
                  te ofrece como cliente un gran número de ventajas. Nuestro
                  objetivo es que todos nuestros clientes queden completamente
                  satisfechos. Para ello, no solo nos tomamos muy en serio la
                  calidad de los productos, sino también a nuestros clientes y
                  su experiencia con estos.
                </p>
              </div>
              <div className="w-full">
                <h1 className="text-2xl font-bold">
                  No te pierdas ninguna novedad con nuestro boletín
                </h1>
                <p className="text-md mt-2">
                  Tras suscribirte a nuestro boletín de noticias,
                  <span className="italic font-semibold"> Posada </span>
                  te mantendrá informado con regularidad sobre ofertas, nuevos
                  productos y consejos profesionales. Además, te mantendremos
                  actualizado igualmente a través de Facebook o Instagram.
                </p>
              </div>
              <div className="space-y-6">
                {featuresSectionContent.map((content) => (
                  <div
                    className="flex flex-col md:flex-row items-start md:items-center gap-4"
                    key={content.id}
                  >
                    <div className="flex justify-center w-full md:w-1/12">
                      {content.icon}
                    </div>
                    <div className="w-full">
                      <h1 className="text-2xl font-bold mb-2 text-center md:text-left">
                        {content.title}
                      </h1>
                      <p className="text-md">{content.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </CardContent>
        </Card>

        <section className="flex flex-wrap gap-5 justify-center mt-32 w-full md:w-5/6 mx-auto">
          {randomImages.map((image) => (
            <Card
              key={image.id}
              className="shadow-2xl cursor-pointer transform transition-transform duration-300 hover:-translate-y-2 w-[400px]"
            >
              <CardContent className="p-0">
                <Image
                  src={image.image}
                  alt={image.title}
                  width={400}
                  height={400}
                  className="w-full object-cover rounded-t-lg h-60"
                />
              </CardContent>
              <CardFooter className="flex justify-center items-center py-6">
                <h1 className="text-lg font-extralight italic">
                  {image.title}
                </h1>
              </CardFooter>
            </Card>
          ))}
        </section>

        <section className="mt-32">
          <h1 className="text-4xl font-black mb-4 text-center">
            Nuestros Clientes
          </h1>
          <div className="max-w-7xl mx-auto flex flex-wrap gap-10 mt-20 justify-center">
            {schools.map((school) => (
              <Avatar key={school.id} className="w-40 h-40 border-4">
                <AvatarImage src={school.image}></AvatarImage>
              </Avatar>
            ))}
          </div>
        </section>

        <Stepper steps={stepperContent} variant="outlined" />
        <HomeFormContact />
      </div>
      <div className="w-full h-60 bg-black"></div>
    </div>
  );
}

export default page;
