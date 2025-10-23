import logger from '../logs/logger.js';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// Crear evento
export const crearEvento = async (req, res, next) => {
  try {
    const { titulo, descripcion, fechaEvento, casoId, creadoPorId } = req.body;

    const evento = await prisma.evento.create({
      data: { titulo, descripcion, fechaEvento, casoId, creadoPorId },
    });

    res.status(201).json({
      message: 'Evento creado exitosamente',
      data: evento,
    });
  } catch (error) {
    next(error);
  }
};

// Listar eventos
export const listarEventos = async (req, res, next) => {
  try {
    const eventos = await prisma.evento.findMany({
      include: {
        caso: { select: { id: true, nombreCaso: true, numeroRadicado: true } },
        creadoPor: { select: { id: true, nombre: true, rol: true } },
      },
      orderBy: { fechaEvento: 'desc' },
    });

    const total = await prisma.evento.count();

    res.json({ total, data: eventos });
  } catch (error) {
    next(error);
  }
};

// Obtener evento por ID
export const obtenerEvento = async (req, res, next) => {
  try {
    const { id } = req.params;

    const evento = await prisma.evento.findUnique({
      where: { id },
      include: {
        caso: true,
        creadoPor: true,
      },
    });

    if (!evento)
      return res.status(404).json({ message: 'Evento no encontrado' });

    res.json(evento);
  } catch (error) {
    next(error);
  }
};

// Actualizar evento
export const actualizarEvento = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const evento = await prisma.evento.update({
      where: { id },
      data,
    });

    res.json({ message: 'Evento actualizado', data: evento });
  } catch (error) {
    next(error);
  }
};

// Eliminar evento
export const eliminarEvento = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.evento.delete({ where: { id } });

    res.json({ message: 'Evento eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};