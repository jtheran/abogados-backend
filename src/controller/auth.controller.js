import createToken from '../libs/jwt.js';
import logger from '../logs/logger.js';
import daysjs from 'dayjs';
import crypto from 'crypto';
import { sendEmail } from '../services/nodemailer.js';
import { matchPass } from '../libs/bcrypt.js';
import pkg from '@prisma/client';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();
const otpStore = new Map(); // clave: email, valor: { otp, expiresAt }

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.usuario.findUnique({
            where: {
                email
            }
        });

        if(!user){
            return res.status(404).json({ msg: 'USUARIO NO ESTA REGISTRADO' });
        }

        const isValidated = await matchPass(password, user.passwordHash);

        if(!isValidated){
            logger.warn('[AUTH] CORREO O PASSWORD ERRONEA!!!!');
            return res.status(400).json({ msg: 'CORREO O PASSWORD ERRONEA' });
        }

        const data = {
            id: user.id,
            email: user.email,
            rol: user.rol,
            nombre: user.nombre,
            estado: user.estado, 
        };

        // Genera ambos tokens
        const { accessToken, refreshToken } = createToken(data);
        const now = daysjs().toDate();

        await prisma.usuario.update({
            where: {
                id: user.id
            },
            data: {
                ultimoAcceso: now,
            }
        });

        return res.status(200).json({
            msg: 'LOGUEADO CORRECTAMENTE',
            accessToken,
            refreshToken,
        });
    }catch(err){
        return res.status(500).json({ msg: 'ERROR INTERNO DEL SERVIDOR: ' + err.message });
    }
};


export const logout = (req, res) => {
    try{
        return res.status(200).json({msg: 'HA SIDO DESLOGUEADO!!!'});
    }catch(err){
        return res.status(500).json({ msg: 'ERROR INTERNO DEL SERVIDOR: ' + err.message });
    }
};

export const forgotPasswrod = async (req, res) => {
    try{
        const { email } = req.body;

        const user = await prisma.usuario.findUnique({ where: { email } });

        if(!user){
            return res.status(404).json({ message: 'EMAIL NO CORRESPONDE A UN USUARIO REGISTRADO' });
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        otpStore.set(user.email, { otp, expiresAt });

        await sendEmail(user.email, 'CODIGO OTP DE VERIFICACION', `${user.nombre} este es tu codigo
            OTP de confirmacion de identidad <br>
            CODIGO OTP: ${otp}`,
            `${user.nombre}`
        );

        return res.status(200).json({msg: 'CODIGO OTP ENVIADO EXITOSAMENTE'});

    }catch(err){
        return res.status(500).json({ msg: 'ERROR INTERNO DEL SERVIDOR' });
    }
}

export const resetPassword = async (req, res) => {
    try{
        const { email, otp, newPassword, confirmPassword } = req.body;

        const user = await prisma.usuario.findUnique({ where: { email } });
        
        if(!user){
            return res.status(404).json({ msg: 'EMAIL NO CORRESPONDE A UN USUARIO REGISTRADO' });
        }

        const stored = otpStore.get(email);

        if(!stored || stored.otp !== otp || stored.expiresAt < new Date()){
            return res.status(400).json({ msg: 'CODIGO OTP INVALIDO O EXPIRADO' });
        }

        if(!newPassword || !confirmPassword || newPassword !== confirmPassword){
            return res.status(400).json({ msg: 'LAS CONTRASEÑAS NO COINCIDEN O SON INVALIDAS' });
        }

        const hashPass = await encryptPass(newPassword);

        const updateUser = await prisma.usuario.update({
            where: {
                email: user.email,
            },
            data: {
                password: hashPass,
            }
        });

        if(!updateUser){
            return res.status(404).json({ msg: 'PASSWORD DEL USUARIO NO PUDO SER ACTUALIZADA' });
        }

        otpStore.delete(email);

        return res.status(200).json({msg: 'PASSWORD DEL USUARIO ACTUALIZADA EXITOSAMENTE'});
    }catch(err){
        return res.status(500).json({ msg: 'ERROR INTERNO DEL SERVIDOR' });
    }
}



