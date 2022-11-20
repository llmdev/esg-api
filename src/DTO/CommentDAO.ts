import pgp from 'pg-promise'
import pg from 'pg-promise/typescript/pg-subset';
import CommentError from '../entities/errors/CommentError';
import User from '../entities/User';
import UserDAO from './UserDAO';


export default class CommentDAO {
    constructor(private connection: pgp.IDatabase<{}, pg.IClient>){}

    async findByTopic(id: number) {
        try {
            const comments = await this.connection.query('SELECT c.id, c.content, u.nickname FROM comments c INNER JOIN users u ON (u.id = c.user_id) where c.topic_id = ${id}', {
                id,
            });
    
            return comments as Comment;
        } catch (error) {
            throw new CommentError('Erro ao buscar comentarios para este topico.')
        }
    }

    async save(content: string, topic_id: number, user: User) {
        try {
            const dbComment = await this.connection.one('INSERT INTO comments(user_id, content, topic_id) VALUES(${user_id}, ${content}, ${topic_id}) RETURNING *', {
                content,
                topic_id,
                user_id: user.id
            });
            return dbComment;
        } catch (error) {
            console.log(error)
            throw new CommentError('Erro ao cadastrar comentario.')
        }
    }

    async findCommentsByUser(idUser: number) {
        try {
            const comments = await this.connection.query('SELECT * FROM comments where user_id = ${id}', {
                id: idUser
            });
    
            return comments as Comment;
        } catch (error) {
            throw new CommentError('Erro ao buscar comentarios por usuario.')
        }
    }
}