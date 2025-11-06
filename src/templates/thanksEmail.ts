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
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
        }
        .email-container {
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .content {
            padding: 30px 25px;
        }
        .logo-container {
            text-align: center;
            padding: 20px 0;
            background-color: #f8f9fa;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        th, td {
            padding: 12px 8px;
            text-align: left;
            border-bottom: 1px solid #e9ecef;
        }
        th {
            background-color: #f8f9fa;
            font-weight: 600;
            color: #495057;
            text-transform: uppercase;
            font-size: 12px;
            letter-spacing: 0.5px;
        }
        td img {
            border-radius: 4px;
            object-fit: cover;
        }
        .total {
            background-color: #f8f9fa;
            font-weight: bold;
            font-size: 16px;
        }
        .order-details {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            padding: 20px;
            border-radius: 8px;
            margin: 25px 0;
            border-left: 4px solid #4CAF50;
        }
        .order-details h3 {
            margin: 0 0 15px 0;
            color: #2c5530;
            font-size: 18px;
        }
        .order-details p {
            margin: 8px 0;
            font-size: 14px;
        }
        @media only screen and (max-width: 600px) {
            body { padding: 10px; }
            .content { padding: 20px 15px; }
            .header { padding: 25px 15px; }
            .header h1 { font-size: 20px; }
            table { font-size: 12px; }
            th, td { padding: 8px 4px; }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="logo-container">
            <img src="${imageUrl}" alt="Fotos Posada" style="width: 200px; height: 150px; object-fit: contain;"/>
        </div>
        <div class="header">
            <h1>¡Muchas gracias por comprar en Fotos POSADA!</h1>
        </div>
        <div class="content">
        <p style="font-size: 16px; margin-bottom: 20px;">Estimado/a cliente,</p>
        
        <p style="font-size: 16px; margin-bottom: 20px;">¡Muchas gracias por confiar en nosotros! Su compra ha sido procesada exitosamente.</p>
        
        <div style="text-align: center; background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 25px 0;">
            <p style="margin: 0; font-size: 14px; color: #6c757d;">Número de orden</p>
            <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #4CAF50;">#${
              sale.order
            }</p>
        </div>
        
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
        <div style="background-color: #f0f8ff; border-left: 4px solid #4CAF50; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <h4 style="margin: 0 0 10px 0; color: #2c5530;">📞 Atención al Cliente</h4>
            <p style="margin: 0 0 8px 0;">Si tiene alguna consulta sobre su pedido, nuestro equipo está disponible para ayudarle a través de WhatsApp.</p>
            <p style="margin: 0; font-weight: bold; color: #25D366;">📱 WhatsApp: +54 9 11 5403-2747</p>
        </div>
        
        <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 12px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #856404;">
                <strong>⚠️ Importante:</strong> Este es un correo automático. Por favor, no responda a este email. 
                Para cualquier consulta, comuníquese exclusivamente a través de nuestro WhatsApp oficial.
            </p>
        </div>
        
        <div style="text-align: center; margin-top: 40px; padding: 25px; background-color: #f8f9fa; border-radius: 8px;">
            <p style="margin: 0; font-size: 16px; font-style: italic; color: #495057; line-height: 1.5;">
                ¡Esperamos que disfrute de sus fotos y esperamos poder servirle nuevamente en el futuro!
            </p>
            <p style="margin: 15px 0 0 0; font-size: 14px; color: #6c757d;">
                Equipo Fotos POSADA 📸
            </p>
        </div>
        </div>
    </div>
</body>
</html>
`;
};
