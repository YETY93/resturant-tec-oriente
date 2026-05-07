module.exports = (req, res) => {
  // Esta es una función serverless dummy
  // La app real necesita reestructuración completa para Vercel
  res.status(500).json({
    error: 'SERVERLESS_NOT_CONFIGURED',
    message: 'Esta aplicación Express tradicional no funciona en Vercel Serverless',
    solution: 'Ver README para instrucciones de deployment local o usar VPS/Heroku',
    contact: 'Yesid Rangel Orozco - 321 123 4567'
  });
};