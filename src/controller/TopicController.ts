import { Response } from "express"
import Topic from "../entities/Topic";
import pgp from "pg-promise";
import pg from "pg-promise/typescript/pg-subset";
import TopicError from "../entities/errors/TopicError";
import TopicDAO from "../DTO/TopicDAO";
import Category from "../entities/Category";
import CategoryDAO from "../DTO/CategoryDAO";
import CategoryError from "../entities/errors/CategoryError";


export default class TopicController {

  constructor(private connection: pgp.IDatabase<{}, pg.IClient>) {}

  async createTopic(req: any, res: Response) {
    try { 
      const { title, content, category } = req.body;
      const categoryDB = await new CategoryDAO(this.connection).find(category);
      const topic = new Topic(title, content, categoryDB, req.context.user);
      const topicDB = await new TopicDAO(this.connection).save(topic);
      res.json({
        message: 'Topico cadastrado com sucesso',
        ...topicDB
      });   
    } catch (error) {
      if (error instanceof TopicError || error instanceof CategoryError) {
        res.statusCode = 400;
        res.json({
          erro: error.message
        });
      }
    }
  }

  async getTopicsByCategory(req: any, res: Response) {
    const categoryId = req.params.id;
    try {
      const topicsWithCategory = await new TopicDAO(this.connection).getTopicsByCategory(categoryId);
      res.json({
        topics: topicsWithCategory
      })
    } catch (error) {
      if( error instanceof TopicError) {
        res.statusCode = 400;
        res.json({
          error: error.message
        });
      }
    }
  }

  async getTopicById(req: any, res: Response) {
    const topicId = req.params.id
    try {
      const topicdb = await new TopicDAO(this.connection).find(topicId);
      res.json({
        topic: topicdb
      })
    } catch (error) {
      if( error instanceof TopicError) {
        res.statusCode = 400;
        res.json({
          error: error.message
        });
      }
    }
  }
}
