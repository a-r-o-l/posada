export const passwordRecoveryTemplate = (pasword: string) => {
  const imageUrl = `https://malaquitabucket.s3.us-east-2.amazonaws.com/posada/posadalogoblack.png`;
  return `
    <html>
    <body>
      <div>
        <img src="${imageUrl}" alt="posada" style="width: 200px; height: 150px; margin-bottom: 10px;" />
      </div>
      <div>
        <p>
          <strong>Hola, has solicitado recuperar tu contraseña.</strong>
          <br/>
          Tu contraseña es: ${pasword}
        </p>
      </div>
    </body>
    </html>
    `;
};
