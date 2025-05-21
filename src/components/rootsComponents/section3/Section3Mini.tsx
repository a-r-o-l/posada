import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const data = [
  {
    id: 1,
    title: "Archivos digitales",
    text: "Al confirmar el pago te enviaremos el/los archivo elegidos a tu WhatsApp.",
    img: "/ui/products/13x18.jpeg",
  },
  {
    id: 2,
    title: "Carpeta",
    text: "Retrato y grupo en 20 x 25 cm + Multiple ( 2  billerera y 4 carnet de la misma foto de la carpeta).",
    img: "/ui/products/carpetaweb.png",
  },
  {
    id: 3,
    title: "Foto Book",
    text: `• Confeccionado 100% en papel fotográfico.
• Incluye el retrato individual y la foto grupal.
• Tapa dura con escudo del colegio.
• Tamaño abierto: 20 x 30 cm.
• 2 fotos tipo billetera y 4 tipo carnet del retrato elegido.
`,
    img: "/ui/products/bookweb.png",
  },
  {
    id: 4,
    title: "Fotos grupales",
    text: `Formato tradicional impreso.
    Archivo digital para compartir.`,
    img: "/ui/products/grupo.jpeg",
  },
  {
    id: 5,
    title: "Orla",
    text: `Orla impresa.
    Archivo digital para compartir.`,
    img: "/ui/products/orla.jpeg",
  },
  {
    id: 6,
    title: "Copias Impresas",
    text: `Tamaño de impresión:
    • 20 x 25 cm. 
    • 15 x 21 cm. 
    • 13 x 18 cm.
    • multiple (2 billetera + 4 carnet) del retrato elegido.`,
    img: "/ui/products/copiaspapelweb.png",
  },
];

function Section3Mini() {
  return (
    <div
      className="flex flex-col w-full relative mt-20 lg:hidden"
      id="productos"
    >
      <div className="mb-10 flex flex-col text-3xl pl-10">
        <h1 className="font-bold text-[#F9AE48] sm:text-5xl">
          <span className="text-black">Conocé nuestros</span>
          <br />
          <span className="ml-3">productos</span>
        </h1>
      </div>
      <div className="absolute left-0">
        <Image
          src="/ui/seccion3/yellowbar.png"
          width={150}
          height={150}
          alt="section1"
          className="w-[2vw] max-w-[70px] min-w-[20px] min-h-[50vh] object-cover"
        />
      </div>
      <div className="flex flex-1 justify-center items-center relative">
        <div className="w-4/5 bg-[#F9AE48] rounded-l-3xl absolute right-0 top-0 z-10 h-[50vh]"></div>
        <div className="w-[80vw]  border-2 border-[#F9AE48] bg-[#EFF0F9] rounded-3xl mt-10 z-20 flex flex-col">
          <div className="grid grid-cols-1 p-5 gap-5">
            {data.map((p) => (
              <Accordion type="single" collapsible key={p.id}>
                <AccordionItem value="item-1">
                  <AccordionTrigger className="cursor-pointer hover:no-underline">
                    <p className="text-[#F9AE48] text-xl font-bold">
                      {p.title}
                    </p>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col items-center justify-center">
                      <div className="flex flex-1 h-full w-full justify-center items-center">
                        <div className="">
                          <Image
                            src={p.img}
                            width={200}
                            height={200}
                            alt={p.title}
                            className="w-60 h-60 object-contain"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col h-full mt-10 px-10 justify-center">
                        <p className="whitespace-pre-line">{p.text}</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Section3Mini;
