import logger from '../logs/logger.js';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();


export const listarLogs = async (req, res, next) => {
  try {
    const logs = await prisma.log.findMany({
      include: {
        usuario: { select: { id: true, nombre: true, email: true } },
      },
      orderBy: { fechaCreacion: 'desc' },
    });

    const total = await prisma.log.count();

    res.status(200).json({
      message: 'Logs obtenidos correctamente',
      total,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 🔍 Obtener un log por ID
 */
export const obtenerLog = async (req, res, next) => {
  try {
    const { id } = req.params;

    const log = await prisma.log.findUnique({
      where: { id },
      include: {
        usuario: true,
      },
    });

    if (!log) {
      return res.status(404).json({ message: 'Log no encontrado' });
    }

    res.status(200).json({ message: 'Log encontrado', data: log });
  } catch (error) {
    next(error);
  }
};

/**
 * ✏️ Crear un nuevo log
 */
export const crearLog = async (req, res, next) => {
  try {
    const { nivel, mensaje, modulo, usuarioId } = req.body;

    const log = await prisma.log.create({
      data: {
        nivel,
        mensaje,
        modulo,
        usuarioId,
      },
    });

    res.status(201).json({ message: 'Log creado exitosamente', data: log });
  } catch (error) {
    next(error);
  }
};

/**
 * 🧹 Eliminar un log
 */
export const eliminarLog = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.log.delete({ where: { id } });

    res.status(200).json({ message: 'Log eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};