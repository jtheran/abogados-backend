import logger from '../logs/logger.js';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// ✅ Obtener todos los casos
export const getCasos = async (req, res) => {
  try {
    const { rol, id: userId } = req.user;

    const where = {};

    // Si es abogado, solo puede ver sus propios casos
    if (rol === "abogado") {
      where.abogadoId = userId;
    }

    const [casos, total] = await prisma.$transaction([
      prisma.caso.findMany({
        where,
        orderBy: { fechaCreacion: "desc" },
        include: {
          abogado: { select: { id: true, nombre: true, email: true } },
          juzgado: { select: { id: true, nombre: true, ciudad: true } },
          partes: true,
        },
      }),
      prisma.caso.count({ where }),
    ]);

    if (!casos || total === 0) {
      return res.status(404).json({ msg: "No se encontraron casos registrados" });
    }

    return res.status(200).json({ msg: "Casos encontrados", count: total, casos });
  } catch (err) {
    return res.status(500).json({ msg: "Error Interno del Servidor: " + err.message });
  } finally {
    await prisma.$disconnect();
  }
};

// ✅ Obtener caso por ID
export const getCasoById = async (req, res) => {
  try {
    const { id } = req.params;

    const caso = await prisma.caso.findUnique({
      where: { id },
      include: {
        abogado: { select: { id: true, nombre: true, email: true } },
        juzgado: { select: { id: true, nombre: true } },
        partes: {
          include: {
            parte: true,
          },
        },
        documentos: true,
        eventos: true,
        citas: true,
        notificaciones: true,
      },
    });

    if (!caso) {
      return res.status(404).json({ msg: "Caso no encontrado" });
    }

    return res.status(200).json({ msg: "Caso encontrado", caso });
  } catch (err) {
    return res.status(500).json({ msg: "Error Interno del Servidor: " + err.message });
  } finally {
    await prisma.$disconnect();
  }
};

// ✅ Crear nuevo caso
export const createCaso = async (req, res) => {
  try {
    const { numeroRadicado, nombreCaso, descripcion, estado, abogadoId, juzgadoId } = req.body;

    const existCaso = await prisma.caso.findUnique({
      where: { numeroRadicado },
    });

    if (existCaso) {
      return res.status(400).json({ msg: "El número de radicado ya está registrado" });
    }

    const abogado = await prisma.usuario.findUnique({
      where: { id: abogadoId },
    });

    if (!abogado || abogado.rol !== "abogado") {
      return res.status(400).json({ msg: "El abogado asignado no existe o no tiene rol válido" });
    }

    const caso = await prisma.caso.create({
      data: {
        numeroRadicado,
        nombreCaso,
        descripcion,
        estado: estado || "Activo",
        abogadoId,
        juzgadoId,
      },
    });

    return res.status(201).json({ msg: "Caso creado exitosamente", caso });
  } catch (err) {
    return res.status(500).json({ msg: "Error Interno del Servidor: " + err.message });
  } finally {
    await prisma.$disconnect();
  }
};

// ✅ Actualizar caso
export const updateCaso = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombreCaso, descripcion, estado, juzgadoId } = req.body;

    const existCaso = await prisma.caso.findUnique({
      where: { id },
    });

    if (!existCaso) {
      return res.status(404).json({ msg: "Caso no encontrado" });
    }

    const updatedCaso = await prisma.caso.update({
      where: { id },
      data: {
        nombreCaso,
        descripcion,
        estado,
        juzgadoId,
      },
    });

    return res.status(200).json({ msg: "Caso actualizado exitosamente", caso: updatedCaso });
  } catch (err) {
    return res.status(500).json({ msg: "Error Interno del Servidor: " + err.message });
  } finally {
    await prisma.$disconnect();
  }
};

// ✅ Cambiar estado del caso (opcional)
export const cambiarEstadoCaso = async (req, res) => {
  try {
    const { id } = req.params;
    const { nuevoEstado } = req.body;

    const validStates = ["Activo", "Archivado", "Cerrado", "En proceso"];
    if (!validStates.includes(nuevoEstado)) {
      return res.status(400).json({ msg: "Estado no válido" });
    }

    const existCaso = await prisma.caso.findUnique({
      where: { id },
    });

    if (!existCaso) {
      return res.status(404).json({ msg: "Caso no encontrado" });
    }

    const updated = await prisma.caso.update({
      where: { id },
      data: { estado: nuevoEstado },
    });

    return res.status(200).json({ msg: "Estado del caso actualizado", caso: updated });
  } catch (err) {
    return res.status(500).json({ msg: "Error Interno del Servidor: " + err.message });
  } finally {
    await prisma.$disconnect();
  }
};

// ✅ Eliminar caso
export const deleteCaso = async (req, res) => {
  try {
    const { id } = req.params;

    const existCaso = await prisma.caso.findUnique({
      where: { id },
    });

    if (!existCaso) {
      return res.status(404).json({ msg: "Caso no encontrado" });
    }

    // Verificar relaciones (documentos, eventos, etc.)
    const tieneRelaciones =
      (await prisma.documento.count({ where: { casoId: id } })) > 0 ||
      (await prisma.evento.count({ where: { casoId: id } })) > 0;

    if (tieneRelaciones) {
      return res.status(400).json({
        msg: "No se puede eliminar el caso, tiene elementos asociados (documentos o eventos)",
      });
    }

    await prisma.caso.delete({
      where: { id },
    });

    return res.status(200).json({ msg: "Caso eliminado exitosamente" });
  } catch (err) {
    return res.status(500).json({ msg: "Error Interno del Servidor: " + err.message });
  } finally {
    await prisma.$disconnect();
  }
};