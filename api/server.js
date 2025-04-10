const swaggerDocs = require('./swagger'); // Importamos Swagger
require('dotenv').config();
const app = require('./app');

// Aquí configuras las rutas y middlewares

module.exports = app; // Exporta la app sin iniciar el servidor

// Documentación Swagger
swaggerDocs(app);

if (require.main === module) { // Solo inicia el servidor si se ejecuta directamente
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
        console.log(`Documentación disponible en http://localhost:${PORT}/api-docs`);
    });
}