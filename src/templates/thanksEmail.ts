import { paymentStateParser } from "@/lib/utilsFunctions";
import { ISalePopulated, ISaleProductPopulated } from "@/models/Sale";
import { format } from "date-fns";

export const tahnksEmailTemplate = (sale: ISalePopulated) => {
  const imageUrl = `https://fotosposada.s3.us-east-2.amazonaws.com/assets/logoposada.png`;

  return `
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You for Your Purchase</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #f8f8f8;
            padding: 20px;
            text-align: center;
        }
        .content {
            padding: 20px;
        }
        .footer {
            background-color: #f8f8f8;
            padding: 20px;
            text-align: center;
            font-size: 12px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            margin-bottom: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        .total {
            font-weight: bold;
        }
        .order-details {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .order-details p {
            margin: 5px 0;
        }
    </style>
</head>
<body>
<div>
<img src="${imageUrl}" alt="posada" style="width: 200px; height: 150px; margin-bottom: 10px;"/>
</div>
<div class="header">
        <h1>¡Muchas gracias por comprar en fotos POSADA!</h1>
    </div>
<div>
<div class="content">
        <p>Querido cliente,</p>
        
        <p>Muchas gracias por su compra</p>
        
        <p>Tu numero de orden es: <strong>#${sale.order}</strong></p>
        
        <div class="order-details">
            <h3>Detalles de la orden:</h3>
            <p><strong>Fecha:</strong> ${format(
              sale.createdAt!,
              "dd / MM / yyyy"
            )}</p>
            <p><strong>Cliente:</strong> ${sale.accountId.name} ${
    sale.accountId.lastname
  }</p>
            <p><strong>Email:</strong> ${sale.accountId.email}</p>
            <p><strong>Telefono:</strong> ${sale.accountId.phone}</p>
            <p><strong>Estado del pago:</strong> ${
              paymentStateParser(sale.status).text
            }</p>
        </div>
        
        <h3>Lista de productos:</h3>
        
        <table>
            <tr>
                <th>Archivo</th>
                <th>Producto</th>
                <th>Colegio</th>
                <th>Carpeta</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Total</th>
            </tr>
            ${sale.products.map((product: ISaleProductPopulated) => {
              return `
                 <tr>
                <td>
                <img src="${product?.fileId?.imageUrl}" alt="${product?.fileId?.fileName}" style="width: 80; height: 80px; margin-bottom: 10px;"/>
                </td>
                <td>${product?.productId?.name}</td>
                <td>${product?.fileId?.folderId?.schoolId?.name}</td>
                <td>${product?.fileId?.folderId?.title}</td>
                <td>$${product.price}</td>
                <td>${product.quantity}</td>
                <td>$${product.total}</td>
            </tr>
                `;
            })}
            <tr class="total">
                <td colspan="6">Total</td>
                <td>$${sale.total}</td>
            </tr>
        </table>
        <p>Si tiene alguna pregunta sobre su pedido, no dude en ponerse en contacto con nuestro equipo de atención al cliente.</p>
        <p>¡Esperamos que disfrute de sus fotos y esperamos poder servirle nuevamente en el futuro!</p>
    </div>
</body>
</html>
`;
};
