import React from "react";

const data = [
  {
    id: 1,
    text: "Selecciona el grado o curso al que quieras acceder",
  },
  {
    id: 2,
    text: "Busca el retrato de tu hijo/a para encontrar todas sus fotos",
  },
  {
    id: 3,
    text: "En la columna de la derecha te aparecerán todas las opciones de compra",
  },
  {
    id: 4,
    text: "Selecciona todas las fotos que quieras, esto ira directo a tu carrito de compras",
  },
  {
    id: 5,
    text: "Una vez realizado el pago te llegara un email de confirmacion de la compra",
  },
];

function BuyTutorial() {
  return (
    <div className="flex-col w-full items-center gap-5 px-20 py-5 hidden lg:flex">
      <div>
        <h1 className="text-3xl font-black text-[#139FDC]">¿Cómo compro?</h1>
      </div>
      <div className="flex w-full justify-evenly gap-5">
        {data.map((item) => (
          <div
            key={item.id}
            className="flex gap-3 rounded-3xl bg-[#E4E6F2] p-4 items-center w-full min-h-28"
          >
            <div className="flex justify-center items-center rounded-full bg-[#139FDC] w-8 h-8 flex-shrink-0">
              <p className="text-lg text-black font-medium">{item.id}</p>
            </div>
            <div className="flex-1">
              <p className="text-xs text-black leading-tight">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BuyTutorial;
