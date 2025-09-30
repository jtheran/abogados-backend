import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';
import config from '../config/config.js'
import { fileURLToPath } from "url";

const pathYamls = path.resolve('src', 'documentation', '*.yaml');
const pathMetrics = path.resolve('src', 'lib', 'metrics.js');
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Backend Base NodeJS',
            version: '1.0.0',
            description: 'Documentación de la API Base NodeJS',
            contact: {
                name: 'LSV-TECH S.A.S.',
                email: 'contacto@lsv-tech.com',
                url: 'https://www.lsv-tech.com/',
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT',
                description: 'Licencia Gratuita',
            },
        },
        servers: [
            {
                url: `http://localhost:${config.port}`,
                description: 'Servidor Local',
            },
        ],
        tags: [
            {
                name: 'Auth',
                description: 'Operaciones de inicio y cierre de sesión, recuperación de contraseña',
            },
            {
                name: 'Monitoreo',
                description: 'Validacion del estado actual del uso de requerimientos de hardware',
            },
            {
                name: 'Notificaciones',
                description: 'Notificaciones generadas en la Api, por medio de correo, Tiempo Real, Etc.',
            },
            {
                name: 'Logs',
                description: 'Logs del sistema por Usuario, Nivel, Mensaje y Trazabilidad.',
            },
        ],
         components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Ingresa el token JWT proporcionado al iniciar sesión.',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: [pathYamls, pathMetrics], // ajusta según tu estructura
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
