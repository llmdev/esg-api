import express, { Request, Response, NextFunction}from 'express'
import dotenv from 'dotenv'
import midlewares, { authMidleware } from './config/midlewares';
import User from './entities/User';
import UserError from './entities/errors/User';
import pgp from 'pg-promise';
import UserDAO from './DTO/UserDAO';
import TopicController from './controller/TopicController';
import CryptoJS from 'crypto-js';
import CategoryController from './controller/CategoryController';
import UserController from './controller/UserController';
import CommentController from './controller/CommentController';


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

const dbConnection = pgp()(dbSettings);

app.post('/signin', async (req, res) => {
    const { nickname, name, email, password } = req.body;
    try {
        const newUser = new User(nickname, name, email, password);
        const userDTO = new UserDAO(dbConnection);
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
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userDAO = new UserDAO(dbConnection);
        const findedUser = await userDAO.find(email, password);
        return res.json({
            message: 'Usuario encontrado',
            user: {
                id: findedUser.id,
                nickname: findedUser.nickname,
                name: findedUser.name,
                email: findedUser.email,
                token: CryptoJS.AES.encrypt(findedUser.email, "esgplatform").toString()
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

const topicController = new TopicController(dbConnection);
app.post('/topic', authMidleware, (req, res) => topicController.createTopic(req, res));
app.get('/topic/category/:id', (req, res) => topicController.getTopicsByCategory(req, res));
app.get('/topic/:id', (req, res) => topicController.getTopicById(req, res));

const categoryController = new CategoryController(dbConnection);
app.get('/categories', (req, res) => categoryController.getAll(req, res));


const userController = new UserController(dbConnection);
app.get('/user', authMidleware, (req, res) => userController.getUserInfo(req, res));

const commentController = new CommentController(dbConnection);
app.get('/comments/topic/:id', (req, res) => commentController.getByTopic(req, res) )
app.post('/comments', authMidleware, (req, res) => commentController.createComment(req, res) )

app.listen(process.env.PORT, () => {
    console.log(`Server listen on port ${process.env.PORT} 👌👌!`);
});


