import { Request, Response } from "express"
import Topic from "../entities/Topic";

export default class TopicController {

  constructor() {}

  createTopic(req: Request) {

    const { title, content, category } = req.body;
    const token = req.headers?.authorization;
    // const topic = new Topic(title, content, category)

  }
}
