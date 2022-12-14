import pgp from "pg-promise";
import pg from "pg-promise/typescript/pg-subset";
import TopicError from "../entities/errors/TopicError";
import Topic from "../entities/Topic";
import User from "../entities/User";

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

    async find(id: number){
        try {
            const topic = await this.connection.one('select t.id, c.title as title_category, u.nickname, t.title, t."content" from topics t inner join users u ON(u.id = t.user_id) inner join categories c on(c.id = t.category) where t.id = ${id}', {
                id
            });
            return topic;
        } catch (error) {
            console.log(error)
            throw new TopicError('Topico nao encontrado');
        }
    }

    async findTopicsByUser(user: User) {
        try {
            const topic = await this.connection.query('select u.id, u.nickname, t.title, t."content" from topics t inner join users u ON(u.id = t.user_id) where u.id = ${id}', {
                id: user.id
            });
            return topic;
        } catch (error) {
            console.log(error)
            throw new TopicError('Topico nao encontrado');
        }
    }
}