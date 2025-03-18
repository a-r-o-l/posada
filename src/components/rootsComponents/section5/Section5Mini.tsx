import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import React from "react";

function Section5Mini() {
  return (
    <div className="lg:hidden flex flex-col mt-20 relative" id="contacto">
      <div className="px-10 z-20">
        <h1 className="text-3xl font-black text-[#812E8A] leading-none">
          ¿Tenés alguna duda?
        </h1>
        <div className="flex justify-center items-center gap-5">
          <h1 className="text-3xl font-black text-center text-[#812E8A]">
            ¡Contactanos!
          </h1>
        </div>
      </div>
      <div className="absolute right-0 top-20 h-[25vh] w-[40vw] bg-[#812E8A] rounded-l-3xl z-10"></div>
      <div
        style={{ backgroundImage: "url(/ui/seccion5/greenwave.png)" }}
        className="m-10 w-[20vw] h-5 bg-contain bg-center bg-no-repeat"
      ></div>
      <div className="px-4 z-20">
        <div className="flex flex-col w-full rounded-3xl border-2 border-[#812E8A]  bg-[#EFF0F9] self-center">
          <div className="flex flex-1 flex-col p-5 justify-between gap-5">
            <p className="text-xs">
              Si tuviste inconvenientes a la hora de iniciar sesión, tuviste un
              problema con tu pedido o tenés alguna duda sobre nuestros
              servicios, rellena nuestro formulario y nos pondremos en contacto
              con usted lo antes posible.
            </p>
            <div className="flex flex-col gap-5">
              <p className="text-xs [&_a]:no-underline [&_a]:text-inherit [&_a]:pointer-events-none">
                <span className="font-black">Cristina Posada</span>
                <br />
                {"+54 9 11 5403-2747"}
                <br />
                {"contacto@fotosposada.com.ar"}
              </p>
            </div>
          </div>
          <div className="flex flex-1 flex-col p-5 lg:p-10 justify-between gap-5">
            <Input placeholder="Nombre" className="bg-[#D1D3E5] h-12" />
            <Input
              placeholder="Correo electrónico"
              className="bg-[#D1D3E5] h-12"
            />
            <Input placeholder="Telefono" className="bg-[#D1D3E5] h-12" />
            <Textarea
              placeholder="Mensaje"
              rows={10}
              className="bg-[#D1D3E5]"
            />
            <Button className="bg-[#812E8A] rounded-full w-full h-10 hover:bg-[#812E8A] hover:opacity-85">
              <Send />
              Enviar
            </Button>
          </div>
        </div>
      </div>
      <div
        style={{ backgroundImage: "url(/ui/seccion2/purplewave.png)" }}
        className="w-[12vw] h-[1vh] md:h-[4vh] bg-contain bg-center bg-no-repeat mt-10"
      ></div>
    </div>
  );
}

export default Section5Mini;
