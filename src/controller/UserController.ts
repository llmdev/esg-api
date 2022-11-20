import { Response } from 'express';
import pgp from 'pg-promise';
import pg from 'pg-promise/typescript/pg-subset';
import TopicDAO from '../DTO/TopicDAO';

export default class UserController {
    private MULTIPLY_POINTS = 1.5
    
    constructor(private connection: pgp.IDatabase<{}, pg.IClient>) {}

    async getUserInfo(req: any, res: Response) {

        try {
            const topicsByUser = await new TopicDAO(this.connection).findTopicsByUser(req.context.user);
          
            res.json({
                user: req.context.user,
                points: topicsByUser.length * this.MULTIPLY_POINTS,
                topics: topicsByUser.length,
                comments: 20,
            });
        } catch (error) {
            res.json({ 
                error: 'Erro'
            })
        }

    }
}