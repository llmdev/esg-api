import Category from "./Category";
import Comment from "./Comment";
import TopicError from "./errors/TopicError";
import User from "./User";

export default class Topic {
  constructor(
    readonly title: string,
    readonly content: string,
    readonly category: Category,
    readonly user: User,
    readonly comments?: Comment[],
  ) {
    if ( title === '' || title === undefined ) { 
      throw new TopicError("Erro de topico: Title obrigatorio");
    }
    if ( content === '' || content === undefined ) { 
      throw new TopicError("Erro de topico: Conteudo obrigatorio");
    }
  }
}
