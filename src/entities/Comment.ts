import User from "./User";

export default class Comment {
  constructor(
    readonly user_id: number,
    readonly content: string
  ) {}
}
