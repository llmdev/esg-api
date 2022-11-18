import express from 'express'
import dotenv from 'dotenv'
import midlewares from './config/midlewares';
import User from './entities/User';
import UserError from './entities/errors/User';
import pgp from 'pg-promise';
import UserDTO from './DTO/User';

dotenv.config()

const app = express();

midlewares(app);

const dbSettings = {
    host: process.env.DB_HOST,
    port: 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    max: 30
};


app.post('/signin', async (req, res) => {
    const dbConnection = pgp()(dbSettings);
    const { nickname, name, email, password } = req.body;
    try {
        const newUser = new User(nickname, name, email, password);
        const userDTO = new UserDTO(dbConnection);
        const dbUser = await userDTO.save(newUser)
        res.json({
            message: 'Novo usuario cadastrado com sucesso!!',
            data: {
                id: dbUser.id,
                nickname: dbUser.nickname,
                name: dbUser.name
            }
        })
    
    } catch (error) {
        if (error instanceof UserError) {
            res.statusCode = 400;
            res.json({
                error: error.message
            })
        }
    } 
    dbConnection.$pool.end;
});

app.post('/login', async (req, res) => {
    const dbConnection = pgp()(dbSettings);
    const { email, password } = req.body;
    try {
        const userDTO = new UserDTO(dbConnection);
        const findedUser = await userDTO.find(email, password);
        return res.json({
            message: 'Usuario encontrado',
            user: {
                id: findedUser.id,
                nickname: findedUser.email,
                name: findedUser.name,
                email: findedUser.email,
            }
        });
    } catch (error) {
        if (error instanceof UserError) {
            res.statusCode = 404;
            res.json({
                error: error.message
            })
        }
    }
    dbConnection.$pool.end;
})


app.listen(process.env.PORT, () => {
    console.log(`Server listen on port ${process.env.PORT} 👌👌!`);
});