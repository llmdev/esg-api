import pgp from 'pg-promise'
import pg from 'pg-promise/typescript/pg-subset';
import Category from '../entities/Category';
import CategoryError from '../entities/errors/CategoryError';

export default class CategoryDAO {
    constructor(private connection: pgp.IDatabase<{}, pg.IClient>){}

    async find(id: number): Promise<Category> {
        try {
            const category = await this.connection.one('SELECT * FROM categories WHERE id = ${id}', {
                id,
            });
            return category as Category;
        } catch (error) {
            throw new CategoryError('Categoria nao encontrada')
        }
    }
}