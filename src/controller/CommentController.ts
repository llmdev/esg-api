import { Response } from 'express';
import pgp from 'pg-promise'
import pg from 'pg-promise/typescript/pg-subset';
import CommentDAO from '../DTO/CommentDAO';
import CommentError from '../entities/errors/CommentError';


export default class CommentController {

    private commentDAO: CommentDAO;

    constructor(private connection: pgp.IDatabase<{}, pg.IClient>) {
        this.commentDAO = new CommentDAO(connection);
    }

    async getByTopic(req: any, res: Response) {
        const topicId = req.params.id;
        try {
            const comments = await this.commentDAO.findByTopic(topicId);
            res.json({
                comments
            })
        } catch (error) {
            if(error instanceof CommentError) {
                res.statusCode = 500
                res.json({
                    erro: error.message
                })
            }
        }
    }

    async createComment(req: any, res: Response) {
        const user = req.context.user;
        try {
            const { content, topicId } = req.body;
            const comment = await this.commentDAO.save(content, topicId, user);
            res.json({
                message: 'Comentario cadastrado com sucesso',
                comment
            });
        } catch (error) {
            if(error instanceof CommentError) {
                res.statusCode = 500
                res.json({
                    erro: error.message
                })
            }
        }
    }
}