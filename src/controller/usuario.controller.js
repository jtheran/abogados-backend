import logger from '../logs/logger.js';
import { enviarNotificaciones, generarPasswordSegura } from '../utils/functions.js';
import pkg from '@prisma/client';
import days from 'dayjs';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export const getUsuarios = async (req, res) => {
    try{
        const { rol } = req.user;

        // Construcción dinámica del filtro
        const where = {
            rol: undefined, // Se asignará más abajo
        };

        if(rol === "admin"){
            where.rol = { in: ["abogado", "cliente"] };
        }

        const [usuarios, total] = await prisma.$transaction([
            prisma.usuario.findMany({
                where,
                orderBy: { fechaRegistro: "desc" },
                select: {
                    id: true,
                    nombre: true,
                    email: true,
                    rol: true,
                    telefono: true,
                    estado: true,
                    fechaRegistro: true,
                },
            }),
            prisma.usuario.count({
                where
            }),
        ]);

        if(!usuarios || total == 0){
            return res.status(404).json({msg: 'no se encontraron usuarios registrados'});
        }

        return res.status(200).json({msg: 'usuarios encontrados', count: total, usuarios });
    }catch(err){
        return res.status(500).json({msg: 'Error Interno del Servidor: '+err.message});
    }finally{
        await prisma.$disconnect();
    }
}

export const getUsuariosById  =async (req, res) => {
    try{
        const { id } = req.params;

        const usuario = await prisma.usuario.findUnique({
            where: {
                id
            }
        });

        if(!usuario){
            return res.status(404).json({msg: 'usuario no encontrado'});
        }

        return res.status(200).json({msg: "usuario encontrado", usuario});
    }catch(err){
        return res.status(500).json({msg: 'Error Interno del Servidor: '+err.message});
    }finally{
        await prisma.$disconnect();
    }
}

export const getPerfil  =async (req, res) => {
    try{
        const { id } = req.user;

        const usuario = await prisma.usuario.findUnique({
            where: {
                id
            }
        });

        if(!usuario){
            return res.status(404).json({msg: 'usuario no encontrado'});
        }

        return res.status(200).json({msg: "usuario encontrado", usuario});
    }catch(err){
        return res.status(500).json({msg: 'Error Interno del Servidor: '+err.message});
    }finally{
        await prisma.$disconnect();
    }
}


export const createUsuario = async (req, res) => {
    try{
        const { nombre, tarjetaProfesional, email, telefono, rol, documento, tipoDocumento } = req.body;

        const existUser = await prisma.usuario.findUnique({
            where: {
                email
            }
        });

        if(existUser){
            return res.status(400).json({msg: 'correo ingresado, ya pertenece a un usuario registrado previamente'});
        }

        const passHash = generarPasswordSegura();
        const usuario = await prisma.usuario.create({
            data: {
                nombre,
                tarjetaProfesional,
                telefono,
                email,
                rol,
                documento,
                tipoDocumento,
                passwordHash: passHash,
            }
        });

        if(!usuario){
            return res.status(400).json({msg: 'creacion de usuario fallida'});
        }else{
            try{
                
            }catch(err){
                throw new Error('Envio de Correo Fallido: '+err.message);
            }
        }

        return res.status(201).json({msg: 'Creacion de usuario exitosa'});
    }catch(err){
        return res.status(500).json({msg: 'Error Interno del Servidor: '+err.message});
    }finally{
        await prisma.$disconnect();
    }
}

export const updateUsuario = async (req, res) => {
    try{
        const { id } = req.params;
        const { nombre, tarjetaProfesional, email, telefono } = req.body;

         const existUser = await prisma.usuario.findUnique({
            where: {
                id
            }
        });

        if(!existUser){
            return res.status(404).json({msg: 'Usuario no encontrado'});
        }

        const updateUsuario = await prisma.usuario.update({
            where: {
                id: existUser.id,
            },
            data: {
                nombre,
                tarjetaProfesional,
                email,
                telefono
            }
        });

        if(!updateUsuario){
            return res.status(400).json({msg: 'Actualizacion del usuario Fallada'});
        }

        return res.status(200).json({msg: 'Actualizacion del usuario Exitosa'});
    }catch(err){
        return res.status(500).json({msg: 'Error Interno del Servidor: '+err.message});
    }finally{
        await prisma.$disconnect();
    }
}


export const deleteUsuario = async (req, res) => {
    try{
         const { id } = req.params;

         const existUser = await prisma.usuario.findUnique({
            where: {
                id
            }
        });

        if(!existUser){
            return res.status(404).json({msg: 'Usuario no encontrado'});
        }

        const deleteUsuario = await prisma.usuario.update({
            where: {
                id: existUser.id,
            },
            data: {
                estado: false,
            }
        });

        if(!deleteUsuario){
            return res.status(400).json({msg: 'Actualizacion del usuario Fallada'});
        }

        return res.status(200).json({msg: 'Usuario Inactivado Exitosamente'});
    }catch(err){
        return res.status(500).json({msg: 'Error Interno del Servidor: '+err.message});
    }finally{
        await prisma.$disconnect();
    }
}

