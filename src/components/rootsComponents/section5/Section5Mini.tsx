"use client";
import LoadingButton from "@/components/LoadingButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { handleSendEmailFromUser } from "@/server/emailsAction";
import { Send } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

function Section5Mini() {
  const [content, setContent] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("username", name);
      formData.append("senderEmail", email);
      formData.append("title", `telefono: ${phone}`);
      formData.append("content", content);
      const res = await handleSendEmailFromUser(formData);
      if (res.success) {
        setLoading(false);
        toast.success("Email enviado exitosamente");
        setContent("");
        setEmail("");
        setName("");
        setPhone("");
      } else {
        setLoading(false);
        toast.error(res.message);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error sending email:", error);
      toast.error("Error al enviar el Email, intente nuevamente");
    }
  }
  return (
    <div className="lg:hidden flex flex-col mt-20 relative" id="contacto">
      <div className="px-10 z-20">
        <h1 className="text-3xl font-black text-[#812E8A] leading-none sm:text-5xl">
          ¿Tenés alguna duda?
        </h1>
        <div className="flex justify-center items-center gap-5">
          <h1 className="text-3xl font-black text-center text-[#812E8A]   sm:text-5xl">
            ¡Contactanos!
          </h1>
        </div>
      </div>
      <div className="absolute right-0 top-20 sm:top-24 h-[25vh] w-[40vw] bg-[#812E8A] rounded-l-3xl z-10"></div>
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
              servicios, completa nuestro formulario y nos pondremos en contacto
              a la brevedad.
            </p>
            <div className="flex flex-col gap-5">
              <p className="text-xs [&_a]:no-underline [&_a]:text-inherit [&_a]:pointer-events-none">
                <span className="font-black">Cristina Posada</span>
                <br />
                {"+54 9 11 5403-2747"}
                <br />
                {/* {"contacto@fotosposada.com.ar"} */}
              </p>
            </div>
          </div>
          <div className="flex flex-1 flex-col p-5 lg:p-10 justify-between gap-5">
            <Input
              placeholder="Nombre"
              className="bg-[#D1D3E5] h-12"
              value={name}
              onChange={({ target }) => setName(target.value)}
            />
            <Input
              placeholder="Correo electrónico"
              className="bg-[#D1D3E5] h-12"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
            />
            <Input
              placeholder="Telefono"
              className="bg-[#D1D3E5] h-12"
              value={phone}
              onChange={({ target }) => setPhone(target.value)}
            />
            <Textarea
              placeholder="Mensaje"
              rows={10}
              className="bg-[#D1D3E5]"
              value={content}
              onChange={({ target }) => setContent(target.value)}
            />
            <LoadingButton
              title="Enviar"
              loading={loading}
              disabled={!content || !email || !name || loading}
              onClick={async () => {
                await onSubmit();
              }}
              classname="bg-[#812E8A] rounded-full w-full h-10 hover:bg-[#812E8A] hover:opacity-85"
            >
              <Send />
            </LoadingButton>
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
