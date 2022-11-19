
import cors from 'cors';
import express, { Express, Request, Response, NextFunction } from 'express'
import UserDAO from '../DTO/UserDAO';
import User from '../entities/User';
import pgp, { errors } from 'pg-promise';


export default (app: Express) => {

    app.use(cors({
        origin: '*'
    }));
    
    app.use(express.json());
}

export async function authMidleware(req: any, res: Response, next: NextFunction) {
    const dbSettings = {
        host: process.env.DB_HOST,
        port: 5432,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        max: 30
    };
    const dbConnection = pgp()(dbSettings);
    const token = req.headers?.authorization;

    if(token) {
        const user = await new UserDAO(dbConnection).findWithToken(token)
        if (user instanceof User) {
            req.context = {
                user
            };
            next();
        } else {
            res.statusCode = 401;
            res.json({
                error: 'Usuario invalido'
            });
        }
    } else {
        res.statusCode = 401;
        res.json({
            error: 'Rota autenticada, preciso de token para validacao.'
        });
    }
}
