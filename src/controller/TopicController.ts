import { Response } from "express"
import Topic from "../entities/Topic";
import pgp from "pg-promise";
import pg from "pg-promise/typescript/pg-subset";
import TopicError from "../entities/errors/TopicError";
import TopicDAO from "../DTO/TopicDAO";


export default class TopicController {

  constructor(private connection: pgp.IDatabase<{}, pg.IClient>) {}

  async createTopic(req: any, res: Response) {
    try { 
      const { title, content, category } = req.body;
      const topic = new Topic(title, content, category, req.context.user);
      const topicDB = await new TopicDAO(this.connection).save(topic);
      res.json({
        message: 'Topico cadastrado com sucesso',
        ...topicDB
      });   
    } catch (error) {
      if (error instanceof TopicError) {
        res.statusCode = 400;
        res.json({
          erro: error.message
        });
      }
    }
  }
}
