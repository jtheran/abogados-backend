import logger from '../logs/logger.js';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// 📩 Crear notificación
export const crearNotificacion = async (req, res, next) => {
  try {
    const { tipo, mensaje, estado, usuarioId, casoId } = req.body;

    const notificacion = await prisma.notificacion.create({
      data: {
        tipo,
        mensaje,
        estado: estado || 'Pendiente',
        usuarioId,
        casoId,
      },
    });

    res.status(201).json({
      message: 'Notificación creada exitosamente',
      data: notificacion,
    });
  } catch (error) {
    next(error);
  }
};

// 📜 Listar notificaciones
export const listarNotificaciones = async (req, res, next) => {
  try {
    const notificaciones = await prisma.notificacion.findMany({
      include: {
        usuario: { select: { id: true, nombre: true, email: true } },
        caso: { select: { id: true, nombreCaso: true, numeroRadicado: true } },
      },
      orderBy: { fechaEnvio: 'desc' },
    });

    const total = await prisma.notificacion.count();

    res.json({ total, data: notificaciones });
  } catch (error) {
    next(error);
  }
};

// 🔍 Obtener una notificación por ID
export const obtenerNotificacion = async (req, res, next) => {
  try {
    const { id } = req.params;

    const notificacion = await prisma.notificacion.findUnique({
      where: { id },
      include: {
        usuario: true,
        caso: true,
      },
    });

    if (!notificacion) {
      return res.status(404).json({ message: 'Notificación no encontrada' });
    }

    res.json(notificacion);
  } catch (error) {
    next(error);
  }
};

// ✏️ Actualizar notificación
export const actualizarNotificacion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const notificacion = await prisma.notificacion.update({
      where: { id },
      data,
    });

    res.json({ message: 'Notificación actualizada', data: notificacion });
  } catch (error) {
    next(error);
  }
};

// 🗑️ Eliminar notificación
export const eliminarNotificacion = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.notificacion.delete({ where: { id } });

    res.json({ message: 'Notificación eliminada correctamente' });
  } catch (error) {
    next(error);
  }
};

