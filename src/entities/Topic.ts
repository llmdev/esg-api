import Comment from "./Comment";
import User from "./User";

export default class Topic {
  constructor(
    readonly title: string,
    readonly content: string,
    readonly category: string,
    readonly user: User,
    readonly comments?: Comment[],
  ) {}
}
