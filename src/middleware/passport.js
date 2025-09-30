import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import pkg from '@prisma/client';
import config from '../config/config.js';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const options = {

    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.key,
};

const jwtStrategy = new JwtStrategy(options, async (jwt_payload, done) => {
        try{
            const user = await prisma.usuario.findUnique({
                where: { id: jwt_payload.id }
            });
    
            if(user)return done(null, user);
            return done(null, false);
        }catch(err){
            return done(err, false);
        }
    })

export default jwtStrategy;