import express from 'express';
import http from 'http';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './utils/swagger.js';
import config from './config/config.js';
// Importación de tus rutas
import authRoutes from './routes/auth.route.js';
import maintenaceRoutes from './routes/maintenance.route.js';

//* INICIALIZACIÓN
const app = express();
const server = http.createServer(app);

//* MIDDLEWARES
const allowedOrigins = [
    'http://localhost:3000', // Frontend de desarrollo local
    `http://localhost:${config.port}`,
];

app.use(cors({
    origin: function (origin, callback) {
        if(!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        }else{
            callback(new Error('Origen no permitido por CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
    allowedHeaders: ['Content-Type', 'Authorization'],    
    credentials: true,                                    
}));

// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    withCredentials: true,
    requestInterceptor: (request) => {
      // Asegura que las cookies se envíen
      request.credentials = 'include';
      return request;
    }
  },
  customSiteTitle: 'API Docs - ERP-LAW',
}));

// --- Middlewares estándar ---
app.use(morgan('dev')); 
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); 
app.use(express.json()); 
app.use(helmet({ contentSecurityPolicy: false }));

//Rutas
app.use('/api', authRoutes);
app.use('/api', maintenaceRoutes);

export default server;