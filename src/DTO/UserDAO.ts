import User from "../entities/User";
import pgp from "pg-promise";
import pg from "pg-promise/typescript/pg-subset";
import UserError from "../entities/errors/User";
import md5 from "md5";
import CryptoJS from 'crypto-js';

export interface IUserDTO {
    id: number;
    name: string;
    nickname: string;
    email: string;
    password: string;
}

export default class UserDAO {

    constructor(private connection: pgp.IDatabase<{}, pg.IClient>) {}

    async save(user: User): Promise<IUserDTO> {
        try {
            const dbUser: IUserDTO = await this.connection.one('INSERT INTO users(nickname, name, email, password) VALUES(${nickname}, ${name}, ${email}, ${password}) RETURNING *', {
                nickname: user.nickname,
                name: user.name,
                email: user.email,
                password: user.password
            })
            return dbUser;
        } catch (error) {
            throw new UserError('Erro ao criar usuario, ou email ja cadastrado por favor tente novamente mais tarde')
        }
    }

    async find(email: string, password: string): Promise<IUserDTO> {
        const md5Password = md5(password);
        try {
            const user = await this.connection.one('SELECT * FROM users WHERE email = ${email} AND password = ${password}', {
                email,
                password: md5Password
            });
            return user;
        } catch (error) {
            throw new UserError('Usuario nao encontrado')
        }
    }

    async findWithToken(token: string): Promise<User | boolean> {
        const decryptedToken = CryptoJS.AES.decrypt(token.replace('Bearer', '').trim(), "esgplatform").toString(CryptoJS.enc.Utf8)
      
        try {
            const user = await this.connection.one('SELECT * FROM users WHERE email = ${email}', {
                email: decryptedToken
            });
        
            return new User(user.nickname, user.name, user.email, user.password, user.id);
        } catch(e) {
            return false
        }
    }
}
