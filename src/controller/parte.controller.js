import logger from '../logs/logger.js';
import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// ✅ Obtener todas las partes
export const getPartes = async (req, res) => {
  try {
    const [partes, total] = await prisma.$transaction([
      prisma.parte.findMany({
        orderBy: { nombre: "asc" },
        select: {
          id: true,
          nombre: true,
          tipoParte: true,
          documentoIdentidad: true,
          telefono: true,
          email: true,
          direccion: true,
        },
      }),
      prisma.parte.count(),
    ]);

    if(!partes || total === 0){
      return res.status(404).json({ msg: "No se encontraron partes registradas" });
    }

    return res.status(200).json({
      msg: "Partes encontradas",
      count: total,
      partes,
    });
  }catch(err){
    return res.status(500).json({msg: "Error Interno del Servidor: " + err.message});
  }finally{
    await prisma.$disconnect();
  }
};

// ✅ Obtener una parte por ID
export const getParteById = async (req, res) => {
  try {
    const { id } = req.params;

    const parte = await prisma.parte.findUnique({
      where: { id },
    });

    if(!parte){
      return res.status(404).json({ msg: "Parte no encontrada" });
    }

    return res.status(200).json({ msg: "Parte encontrada", parte });
  }catch(err){
    return res.status(500).json({msg: "Error Interno del Servidor: " + err.message,});
  }finally{
    await prisma.$disconnect();
  }
};

// ✅ Crear una nueva parte
export const createParte = async (req, res) => {
  try {
    const { nombre, tipoParte, documentoIdentidad, telefono, email, direccion } = req.body;

    if (!nombre || !tipoParte || !documentoIdentidad || !email) {
      return res.status(400).json({ msg: "El nombre, el tipo de parte, documento de identidad y el correo son obligatorios" });
    }

    const parte = await prisma.parte.create({
      data: {
        nombre,
        tipoParte,
        documentoIdentidad,
        telefono,
        email,
        direccion,
      },
    });

    if(!parte){
      return res.status(400).json({ msg: "Creación de parte fallida" });
    }

    return res.status(201).json({ msg: "Parte creada exitosamente", parte });
  }catch(err){
    return res.status(500).json({msg: "Error Interno del Servidor: " + err.message,});
  }finally{
    await prisma.$disconnect();
  }
};

// ✅ Actualizar una parte existente
export const updateParte = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, tipoParte, documentoIdentidad, telefono, email, direccion } = req.body;

    const existParte = await prisma.parte.findUnique({ where: { id } });

    if(!existParte){
      return res.status(404).json({ msg: "Parte no encontrada" });
    }

    const parteActualizada = await prisma.parte.update({
      where: { id },
      data: {
        nombre,
        tipoParte,
        documentoIdentidad,
        telefono,
        email,
        direccion,
      },
    });

    return res.status(200).json({
      msg: "Parte actualizada exitosamente",
      parte: parteActualizada,
    });
  }catch(err){
    return res.status(500).json({msg: "Error Interno del Servidor: " + err.message,});
  }finally{
    await prisma.$disconnect();
  }
};

// ✅ Eliminar una parte (borrado físico)
export const deleteParte = async (req, res) => {
  try {
    const { id } = req.params;

    const existParte = await prisma.parte.findUnique({ where: { id } });

    if(!existParte){
      return res.status(404).json({ msg: "Parte no encontrada" });
    }

    await prisma.parte.delete({where: { id },});

    return res.status(200).json({ msg: "Parte eliminada exitosamente" });
  }catch(err){
    return res.status(500).json({
      msg: "Error Interno del Servidor: " + err.message,
    });
  }finally{
    await prisma.$disconnect();
  }
};
