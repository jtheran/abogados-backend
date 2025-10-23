import logger from "../logs/logger.js";
import { getIO } from "./socket.js";
import { sendEmail } from "../services/nodemailer.js";
import pkg from "@prisma/client";
import daysjs from "dayjs";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();
const now = daysjs().toDate();
export const enviarNotificaciones = async (contenido, user, tipo, casoID = null) => {
  try{
    const io = await getIO();

    let data = {};

    if(casoID){
      data.casoId = casoID;
      data.mensaje = contenido;
      data.usuarioId = user.id
      data.tipo = tipo;
    }else{
      data.mensaje = contenido;
      data.usuarioId = user.id
      data.tipo = tipo;
    }

    const notificacion = await prisma.notificacion.create({
      data: data
    });

    if(!notificacion){
      return new Error("CREACION DE NOTIFICACION FALLIDA");
    }else{
      io.emit("notificacion", {
        titulo,
        contenido,
        fecha: now,
      });
      await sendEmail(user.email, titulo, contenido, user.name);
    }
  }catch(err){
    return new Error("ERROR AL GENERAR NOTIFICACIONES");
  }
};

export const generarPasswordSegura = () => {
  const mayusculas = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const minusculas = "abcdefghijklmnopqrstuvwxyz";
  const numeros = "0123456789";
  const simbolos = "!@#$%^&*()_+[]{}|;:,.<>?";

  const todas = mayusculas + minusculas + numeros + simbolos;

  // Longitud aleatoria entre 8 y 12
  const longitud =  Math.floor(Math.random() * 5) + 8;

  // Asegurar al menos uno de cada tipo requerido
    let password = [
    mayusculas[Math.floor(Math.random() * mayusculas.length)],
    numeros[Math.floor(Math.random() * numeros.length)],
    simbolos[Math.floor(Math.random() * simbolos.length)],
  ];

  // Rellenar el resto con caracteres aleatorios
  for (let i = password.length; i < longitud; i++) {
    password.push(todas[Math.floor(Math.random() * todas.length)]);
  }

  // Mezclar la contraseña para evitar patrón predecible
  const pass = password.sort(() => Math.random() - 0.5).join("");
  return pass;
}

