
import cors from 'cors';
import express, { Express } from 'express'

export default (app: Express) => {

    app.use(cors({
        origin: '*'
    }));
    
    app.use(express.json());

}