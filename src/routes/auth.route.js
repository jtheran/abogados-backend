import { Router } from 'express';
import passport from 'passport';
import { login, logout, forgotPasswrod, resetPassword } from '../controller/auth.controller.js';
import { authorizeRoles } from '../middleware/auth.js';
import limiter from '../utils/ratelimiter.js';

const router = Router();


router.post('/auth/login', limiter, login);

router.post('/auth/logout', passport.authenticate('jwt', { session: false}), authorizeRoles(['admin', 'abogado', 'cliente']), logout); 

router.post('/auth/forgot-password', forgotPasswrod);

router.post('/auth/reset-password', resetPassword);


export default router;