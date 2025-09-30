import pkg from '@prisma/client';
import { encryptPass } from '../libs/bcrypt.js';
const { PrismaClient } = pkg;
import config from '../config/config.js';


const prisma = new PrismaClient();

async function createAdminUser() {
    const adminEmail = config.adminEmail;

    const existingAdmin = await prisma.usuario.findUnique({
        where: { email: adminEmail },
    });

    if (!existingAdmin){
        const hashedPassword = await encryptPass(config.adminPass);

        const admin = await prisma.usuario.create({
            data: {
                nombre: "ADMIN ERP-LAW",
                email: adminEmail,
                rol: 'admin',
                tarjetaProfesional: '0000001',
                documento: '1234567890',
                tipoDocumento: 'CC',
                passwordHash: hashedPassword,
                telefono: "3026973255",
            },
        });
        console.dir(admin)
        console.log(config.adminPass)
    }else{
        console.log('fkvkvr')
    }
}

export default createAdminUser;