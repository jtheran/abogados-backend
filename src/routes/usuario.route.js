import express from "express";
import passport from "passport";
import { authorizeRoles } from '../middleware/auth.js';
import { 
    createUsuario,
    deleteUsuario,
    getPerfil,
    getUsuarios,
    getUsuariosById,
    updateUsuario
} from '../controller/usuario.controller.js';

const router = express.Router();

router.get('/user', passport.authenticate('jwt', { session: false}), authorizeRoles(['admin']), getUsuarios);

router.get('/user/:id', passport.authenticate('jwt', { session: false}), authorizeRoles(['admin']), getUsuariosById);

router.get('/perfil', passport.authenticate('jwt', { session: false}), authorizeRoles(['admin', 'abogado', 'cliente']), getPerfil);

router.post('/user', passport.authenticate('jwt', { session: false}), authorizeRoles(['admin']), createUsuario);

router.put('/user/:id', passport.authenticate('jwt', { session: false}), authorizeRoles(['admin', 'abogado', 'cliente']), updateUsuario);

router.delete('/user/:id', passport.authenticate('jwt', { session: false}), authorizeRoles(['admin']), deleteUsuario);


export default router;
