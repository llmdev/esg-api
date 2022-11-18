export default class UserError extends Error {
    constructor(msg: string) {
        super(msg);
    }
}
