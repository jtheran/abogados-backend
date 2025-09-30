import winston from "winston";
import { dirname } from "path";
import { fileURLToPath } from "url";
import "colors";
import Transport from "winston-transport";
import pkg from "@prisma/client";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const { combine, timestamp, printf } = winston.format;

// 🎨 Formato de logs
const logFormat = printf(({ level, message, timestamp, email, modulo }) => {
  let formattedMessage = `[${timestamp.toUpperCase()}]:[${level.toUpperCase()}] :: [${message}]`;
  if(email){
    formattedMessage += ` [USER: ${email}]`;
  }
  if(modulo){
    formattedMessage += ` [MODULE: ${modulo}]`;
  }
  return formattedMessage;
});

// 🚀 Transporte personalizado hacia Prisma
class PrismaTransport extends Transport {
  async log(info, callback) {
    setImmediate(() => {
      this.emit("logged", info);
    });

    try {
      let user = null;
      // Busca al usuario solo si viene el email en el log
      if (info.email) {
        user = await prisma.usuario.findUnique({
          where: { email: info.email },
        });
      }

      await prisma.log.create({
        data: {
          nivel: info.level, // mapea con tu modelo
          mensaje: info.message ? info.message : 'sin mensaje',
          modulo: info.modulo ?  info.modulo : "General", // si no pasa, por defecto "general"
          usuarioId: user ? user.id : null,
        },
      });

    }catch(err){
      console.error("[SERVER] ❌ Error guardando log en BD:", err.message);
    }

    callback();
  }
}

// 🛠️ Configuración del logger
const logger = winston.createLogger({
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
  transports: [
    new winston.transports.File({
      filename: `${__dirname}/logger.log`,
    }),
    new winston.transports.Console({
      format: combine(logFormat),
    }),
    new PrismaTransport(),
  ],
});

export default logger;
