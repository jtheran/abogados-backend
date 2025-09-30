import logger from '../logs/logger.js';
import pkg from '@prisma/client';
import config from '../config/config.js';
import dayjs from 'days';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();
const SESSION_TIMEOUT_MINUTES = config.timeout;

const checkSessionTimeout = async (req, res, next) => {
    try {
        const user = await prisma.usuario.findUnique({
            where: {
                id: req.user.id
            }
        });

        if(!user){
            return res.status(401).json({ msg: 'ACCESO NO AUTORIZADO' });
        }

        const now = dayjs().toDate();
        const ultimoAcceso = user.ultimoAcceso;
        
        const minutosInactivo = (now - ultimoAcceso) / (1000 * 60);

        if(minutosInactivo > SESSION_TIMEOUT_MINUTES){
            return res.status(403).json({ msg: 'SESIÓN EXPIRADA POR INACTIVIDAD. INICIE SESIÓN DE NUEVO' });
        }

        const updateUser = await prisma.usuario.update({
            where: { 
                id: user.id
            },
            data: { 
                ultimoAcceso: now
            },
        });

        if(!updateUser){
            return res.status(400).json({msg: 'ACTUALIZACION DE ULTIMO ACCESSO DEL USUARIO FALLIDA'});
        }

        next();
    }catch(err){
        return res.status(500).json({ msg: 'ERROR DE SERVIDOR EN VALIDACIÓN DE SESIÓN' });
    }
};

export default checkSessionTimeout;