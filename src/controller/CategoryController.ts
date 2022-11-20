import { Response } from 'express';
import pgp from 'pg-promise';
import pg from 'pg-promise/typescript/pg-subset';
import CategoryDAO from '../DTO/CategoryDAO';

export default class CategoryController {
  private categoryDAO: CategoryDAO

  constructor(private connection: pgp.IDatabase<{}, pg.IClient>) {
    this.categoryDAO = new CategoryDAO(connection);
  }
  
  async getAll(req: any, res: Response) {
    try {
        const categories = await this.categoryDAO.findAll();
        res.json({
            categories
        })
    } catch (error) {
        res.statusCode = 500;
        console.log(error);
        res.json({
            error: 'Erro ao buscar categorias'
        })
    }
  }
}