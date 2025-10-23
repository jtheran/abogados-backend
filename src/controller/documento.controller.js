import logger from '../logs/logger.js';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// Crear documento
export const crearDocumento = async (req, res, next) => {
  try {
    const { nombre, rutaArchivo, tipo, casoId, subidoPorId } = req.body;

    const documento = await prisma.documento.create({
      data: { nombre, rutaArchivo, tipo, casoId, subidoPorId },
    });

    res.status(201).json({
      message: 'Documento creado exitosamente',
      data: documento,
    });
  } catch (error) {
    next(error);
  }
};

// Listar documentos
export const listarDocumentos = async (req, res, next) => {
  try {
    const documentos = await prisma.documento.findMany({
      include: {
        caso: { select: { id: true, nombreCaso: true } },
        subidoPor: { select: { id: true, nombre: true, rol: true } },
      },
    });

    const total = await prisma.documento.count();

    res.json({ total, data: documentos });
  } catch (error) {
    next(error);
  }
};

// Obtener documento por ID
export const obtenerDocumento = async (req, res, next) => {
  try {
    const { id } = req.params;

    const documento = await prisma.documento.findUnique({
      where: { id },
      include: {
        caso: true,
        subidoPor: true,
      },
    });

    if (!documento)
      return res.status(404).json({ message: 'Documento no encontrado' });

    res.json(documento);
  } catch (error) {
    next(error);
  }
};

// Actualizar documento
export const actualizarDocumento = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const documento = await prisma.documento.update({
      where: { id },
      data,
    });

    res.json({ message: 'Documento actualizado', data: documento });
  } catch (error) {
    next(error);
  }
};

// Eliminar documento
export const eliminarDocumento = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.documento.delete({ where: { id } });

    res.json({ message: 'Documento eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};