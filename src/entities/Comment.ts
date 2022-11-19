import User from "./User";

export default class Comment {
  constructor(
    readonly user: User,
    readonly content: string
  ) {}
}
