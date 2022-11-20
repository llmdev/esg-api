import md5 from 'md5'
import UserError from './errors/User';

export default class User {
    nickname: String;
    name: String;
    email: String;
    password: String;
    id?: number;

    constructor(
        nickname: string,
        name: string,
        email: string,
        password?: string,
        id?: number,
        ) {
        if ( nickname === '' || nickname === undefined ) {
            throw new UserError('Usuario invalido: Nickname obrigatorio')
        } else { this.nickname = nickname }
        if ( name === '' || name === undefined ) {
            throw new UserError('Usuario invalido: Name obrigatorio')
        } else { this.name = name }
        if ( email === '' || email === undefined || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) ) {
            throw new UserError('Usuario invalido: Email obrigatorio ou email invalido')
        } else { this.email = email }
        if ( password === '' || password === undefined || password.length < 5 ) {
            throw new UserError('Usuario invalido: Password obrigatorio e/ou precisa ter no minimo 5 caracteres!')
        } else { this.password = md5(password) }
        this.id = id;
    }

}


