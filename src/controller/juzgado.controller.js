import logger from '../logs/logger.js';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// ✅ Obtener todos los juzgados
export const getJuzgados = async (req, res) => {
  try{
    const [juzgados, total] = await prisma.$transaction([
      prisma.juzgado.findMany({
        orderBy: { nombre: "asc" },
      }),
      prisma.juzgado.count(),
    ]);

    if(!juzgados || total === 0){
      return res.status(404).json({ msg: "No se encontraron juzgados registrados" });
    }

    return res.status(200).json({ msg: "Juzgados encontrados", count: total, juzgados });
  }catch(err){
    return res.status(500).json({ msg: "Error Interno del Servidor: " + err.message });
  }finally{
    await prisma.$disconnect();
  }
};

// ✅ Obtener juzgado por ID
export const getJuzgadoById = async (req, res) => {
  try {
    const { id } = req.params;

    const juzgado = await prisma.juzgado.findUnique({
      where: { id },
    });

    if(!juzgado){
      return res.status(404).json({ msg: "Juzgado no encontrado" });
    }

    return res.status(200).json({ msg: "Juzgado encontrado", juzgado });
  }catch(err){
    return res.status(500).json({ msg: "Error Interno del Servidor: " + err.message });
  }finally{
    await prisma.$disconnect();
  }
};

// ✅ Crear nuevo juzgado
export const createJuzgado = async (req, res) => {
  try {
    const { nombre, ciudad, direccion, telefono, email } = req.body;

    // Verificar duplicado por nombre y ciudad
    const existJuzgado = await prisma.juzgado.findFirst({
      where: {
        nombre: nombre,
        ciudad: ciudad,
      },
    });

    if(existJuzgado){
      return res.status(400).json({ msg: "El juzgado ya está registrado en esa ciudad" });
    }

    const juzgado = await prisma.juzgado.create({
      data: {
        nombre,
        ciudad,
        direccion,
        telefono,
        email,
      },
    });

    if(!juzgado){
      return res.status(400).json({ msg: "Creación del juzgado fallida" });
    }

    return res.status(201).json({ msg: "Juzgado creado exitosamente", juzgado });
  }catch(err){
    return res.status(500).json({ msg: "Error Interno del Servidor: " + err.message });
  }finally{
    await prisma.$disconnect();
  }
};

// ✅ Actualizar juzgado
export const updateJuzgado = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, direccion, telefono, email } = req.body;

    const existJuzgado = await prisma.juzgado.findUnique({
      where: { id },
    });

    if(!existJuzgado){
      return res.status(404).json({ msg: "Juzgado no encontrado" });
    }

    const juzgadoActualizado = await prisma.juzgado.update({
      where: { id },
      data: {
        nombre,
        direccion,
        telefono,
        email,
      },
    });

    return res.status(200).json({ msg: "Actualización exitosa", juzgado: juzgadoActualizado });
  }catch(err){
    return res.status(500).json({ msg: "Error Interno del Servidor: " + err.message });
  }finally{
    await prisma.$disconnect();
  }
};

// ✅ Eliminar juzgado
export const deleteJuzgado = async (req, res) => {
  try {
    const { id } = req.params;

    const existJuzgado = await prisma.juzgado.findUnique({
      where: { id },
    });

    if(!existJuzgado){
      return res.status(404).json({ msg: "Juzgado no encontrado" });
    }

    // Verificar si tiene casos asociados
    const casosRelacionados = await prisma.caso.count({
      where: { juzgadoId: id },
    });

    if(casosRelacionados > 0){
      return res.status(400).json({
        msg: "No se puede eliminar el juzgado, tiene casos asociados",
      });
    }

    await prisma.juzgado.delete({
      where: { id },
    });

    return res.status(200).json({ msg: "Juzgado eliminado exitosamente" });
  }catch(err){
    return res.status(500).json({ msg: "Error Interno del Servidor: " + err.message });
  }finally{
    await prisma.$disconnect();
  }
};