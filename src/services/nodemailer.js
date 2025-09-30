import nodemailer from 'nodemailer';
import config from '../config/config.js';
import logger from '../logs/logger.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
    host: config.hostMail,   
    port: config.portMail,                    
    secure: true,
    auth: { 
        user: config.sendMail, 
        pass: config.mailPass
    },
});

export const sendEmail = async (to, subject, text, name = 'USUARIO' ) => {
    try{
        const templatePath = path.resolve('src/templates/template.html');
        let html = fs.readFileSync(templatePath, 'utf8');

        html = html.replace('{{name}}', name);
        html = html.replace('{{message}}', text);

        const mail = await transporter.sendMail(
            { 
                from: config.sendMail, 
                to,
                subject,
                html,
                text,
            });
        console.dir(mail);
    }catch(err){
        return new Error(`❌ ERROR AL ENVIAR A: ${to} → ${err.message}`);
    }
    
};

export const sendMassiveEmail = async (subject, text) => {
    try {
        const users = await prisma.user.findMany({
            where: {
                role: 'USER'
            }
        });

        if(!users){
            logger.warn('[PRISMA] ❗ USERS NOT FOUND!!!!')
        }

        const emailPromises = users.map((user) =>
            sendEmail({
                to: user.email,
                subject,
                text,
                name: user.name,
            })
        );

        const results = await Promise.allSettled(emailPromises);

        const failed = results.filter((r) => r.status === 'rejected');
        const succeeded = results.filter((r) => r.status === 'fulfilled');



        failed.forEach((fail, index) => {
            const user = users[index];
            logger.error(`[EMAIL] ❌ FALLÓ PARA: ${user.name} <${user.email}> → ${fail.reason.message}`);
        });
    } catch (err) {
        return new Error(` ❌ ERROR GENERAL EN ENVÍO MASIVO: ${err.message}`);
    }
};

