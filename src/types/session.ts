import { Session } from "express-session";

export interface ISession extends Session {
    clientId?: string;
    myNum?: number;
}
