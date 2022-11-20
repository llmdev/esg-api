import pgp from "pg-promise";
import pg from "pg-promise/typescript/pg-subset";
import TopicError from "../entities/errors/TopicError";
import Topic from "../entities/Topic";

export default class TopicDAO {
    constructor(private connection: pgp.IDatabase<{}, pg.IClient>){}

    async save(topic: Topic) {
        try {
            const dbTopic = await this.connection.one('INSERT INTO topics(title, content, category, user_id) VALUES(${title}, ${content}, ${category}, ${userId}) RETURNING *', {
                title: topic.title,
                content: topic.content,
                category: topic.category.id,
                userId: topic.user.id
            });
            return dbTopic;
        } catch (error) {
            throw new TopicError('Erro ao cadastrar topico!');
        }
    }

    async getTopicsByCategory(id: number) {
        try {
            const allTopics = await this.connection.query('SELECT * FROM topics WHERE category = ${id}', {
                id
            });
            return allTopics;
        } catch (error) {
            throw new TopicError('Nao encontramos topicos dessa categoria.');
        }
    }
}