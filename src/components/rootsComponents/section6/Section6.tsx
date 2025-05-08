import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";

function Section6() {
  return (
    <div
      className="hidden lg:flex flex-col w-full relative mt-60"
      id="productos"
    >
      <div className="mb-10 flex flex-col text-4xl sm:text-5xl lg:text-6xl pl-10 md:pl-20 leading-none">
        <h1 className="font-bold text-blue-500 text-center">
          <span className="text-black">Preguntas</span>
          <span className="ml-3">Frecuentes</span>
        </h1>
      </div>
      <div className="w-1/2 mx-auto container flex flex-col gap-5 mt-10">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="cursor-pointer hover:no-underline">
              <p className="text-2xl font-bold">
                ¿Cuáles son las ventajas de comprar en nuestra web?
              </p>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-5">
                <li className="text-xl">
                  Posibilidad de pedir fotos escolares 24/7 con facilidad y
                  seguridad.
                </li>
                <li className="text-xl">
                  Más fácil para padres separados. Facilita los pedidos por
                  separado.
                </li>
                <li className="text-xl">
                  Compartir claves de acceso con familiares (abuelos, tíos,
                  etc.).
                </li>
                <li className="text-xl">
                  Mayor variedad de fotografías y productos fotográficos.
                </li>
                <li className="text-xl">
                  Sistema de compras claro e intuitivo.
                </li>
                <li className="text-xl">
                  Plataforma disponible desde celular, tablet o computadora.
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="cursor-pointer hover:no-underline">
              <p className="text-2xl font-bold">¿Qué se puede pedir?</p>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-5 text-xl">
                <li>Combos disponibles: Carpeta o Foto Book.</li>
                <li>Copias impresas en diferentes tamaños.</li>
                <li>
                  Archivos digitales: ideales para imprimir, guardar en el
                  celular, enviar a familiares o compartir en redes sociales.
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="cursor-pointer hover:no-underline">
              <p className="text-2xl font-bold">
                ¿Cómo y Cuándo recibo los archivos digitales?
              </p>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-xl">
                Los recibis por WhatsApp, al número registrado cuando creaste tu
                cuenta o el que pusiste en el sobre. Las fotos se entregan en
                alta resolución. Estamos trabajando para habilitar descarga
                directa después del pago.
              </p>
              <p className="text-xl mt-5">Te los enviamos:</p>
              <ul className="list-disc pl-5 text-xl">
                <li>
                  Dentro de los 5 días tras el retiro de sobres (viernes).
                </li>
                <li>Dentro de los 4 días si el pedido fue por la web.</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="cursor-pointer hover:no-underline">
              <p className="text-2xl font-bold">
                ¿Cuál es la diferencia entre una Carpeta y un Foto Book?
              </p>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-xl font-medium underline">Carpeta:</p>
              <ul className="list-disc pl-5 text-xl">
                <li>
                  Contiene dos fotos 20x25 cm: retrato individual y foto grupal{" "}
                </li>
                <li>Cartulina blanca de 27 x 44 cm (abierta).</li>
                <li>Escudo del colegio impreso en la tapa.</li>
                <li>
                  Incluye una toma múltiple ( 2 fotos tipo billetera y 4 tipo
                  carnet
                  <span className="font-bold"> del retrato elegido.</span>)
                </li>
              </ul>
              <p className="text-xl mt-5 font-medium underline">Foto Book:</p>
              <ul className="list-disc pl-5 text-xl">
                <li>Confeccionado 100% en papel fotográfico. </li>
                <li>Incluye el retrato individual y la foto grupal </li>
                <li>Tapa dura con escudo del colegio.</li>
                <li>Tamaño abierto: 20 x 30 cm.</li>
                <li>
                  Incluye una toma múltiple ( 2 fotos tipo billetera y 4 tipo
                  carnet{" "}
                  <span className="font-bold"> del retrato elegido.</span>)
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="cursor-pointer hover:no-underline">
              <p className="text-2xl font-bold">¿Qué es una ORLA?</p>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-xl">
                Es una fotografía grupal compuesta por los retratos de todos los
                alumnos del curso. Se utiliza si un alumno no puede asistir a la
                toma grupal o si el colegio lo solicita.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="cursor-pointer hover:no-underline">
              <p className="text-2xl font-bold">
                ¿Qué encuadre tienen las fotos?
              </p>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-xl">
                Utilizamos encuadre full frame, tal como se ve en el
                muestrario.En algunos tamaños puede haber un leve reencuadre
                para adaptar al formato solicitado.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="cursor-pointer hover:no-underline">
              <p className="text-2xl font-bold">¿Cuándo llega mi pedido?</p>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-5 text-xl">
                <li>
                  Fotos impresas: Hasta 30 días después de confirmar el pedido.
                </li>
                <li>
                  Fotos digitales:
                  <ul>
                    <li>
                      Dentro de los 5 días luego del retiro de sobres (los
                      viernes).
                    </li>
                    <li>
                      Dentro de los 4 días si el pedido se hizo desde la web.
                    </li>
                  </ul>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="cursor-pointer hover:no-underline">
              <p className="text-2xl font-bold">¿Dónde se entrega el pedido?</p>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-xl">
                La entrega se realiza en el colegio, que se encargará de
                distribuir los pedidos a cada alumno o padre responsable.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="cursor-pointer hover:no-underline">
              <p className="text-2xl font-bold">
                ¿Qué pasa si pierdo el sobre o formulario?
              </p>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-xl">
                Contactanos por WhatsApp para continuar el proceso.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="cursor-pointer hover:no-underline">
              <p className="text-2xl font-bold">
                Hice mal mi pedido, ¿puedo cambiarlo?
              </p>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-xl">
                Sí, siempre y cuando no haya ingresado al laboratorio.
              </p>
              <p className="text-xl">
                Si ya fue procesado, se debe realizar uno nuevo. Contactanos por
                WhatsApp para continuar el proceso.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="cursor-pointer hover:no-underline">
              <p className="text-2xl font-bold">
                Mi pedido llegó incompleto o con error
              </p>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-xl">
                Por favor verificá bien lo solicitado antes de reclamar.Si
                detectás un error, escribinos por WhatsApp incluyendo en un solo
                mensaje:
              </p>
              <ul className="list-disc pl-5 text-xl">
                <li>Nombre del colegio</li>
                <li>Grado</li>
                <li>Nombre del alumno</li>
                <li>Número de pedido</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="cursor-pointer hover:no-underline">
              <p className="text-2xl font-bold">
                Mi hijo falta a la foto grupal
              </p>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-5 text-xl">
                <li>Se enviará la foto grupal sin él.</li>
                <li>Si el colegio lo permite, se le puede enviar una ORLA.</li>
                <li>
                  <p>
                    En caso de ausencia por enfermedad, podés presentar
                    certificado médico en el colegio.
                  </p>
                  <p>Se repetirá la toma grupal solo si el colegio autoriza.</p>
                </li>
                <li>
                  El resto de los compañeros recibirán la foto tomada en la
                  fecha pactada
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="cursor-pointer hover:no-underline">
              <p className="text-2xl font-bold">
                ¿Qué pasa si llueve el día de la sesión?
              </p>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-5 text-xl">
                <li>
                  Si el colegio tiene un espacio cubierto, se realiza ahí.
                </li>
                <li>
                  Se reprogramará y te llegara un aviso para que no falte.
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="cursor-pointer hover:no-underline">
              <p className="text-2xl font-bold">
                Me comuniqué pero no recibí respuesta
              </p>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-xl">
                Podemos tardar entre 2 y 3 días hábiles. No envíes mensajes por
                distintos medios, ya que eso puede generar demoras. Respondemos
                exclusivamente por WhatsApp.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="cursor-pointer hover:no-underline">
              <p className="text-2xl font-bold">¿El sitio es seguro?</p>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-xl">
                ¡Sí! Nuestra plataforma es segura por lo siguiente:
              </p>
              <ul className="list-disc pl-5 text-xl">
                <li>
                  Cifrado SSL: protege los datos entre tu navegador y nuestro
                  servidor.
                </li>
                <li>
                  Acceso restringido: las fotos solo son visibles con un código
                  seguro.
                </li>
                <li>Marca de agua: evita la copia o difusión no autorizada.</li>
                <li>Pagos protegidos: se realizan mediante Mercado Pago.</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="cursor-pointer hover:no-underline">
              <p className="text-2xl font-bold">¿Mis datos son privados?</p>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-xl">
                Sí, son privados. Solo recolectamos los datos necesarios para
                brindar el servicio. No vendemos ni compartimos tus datos con
                terceros.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

export default Section6;
