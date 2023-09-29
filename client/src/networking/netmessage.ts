import { NetConnection } from "./netconnection"

export const AUTHORISE_SUCCESS = true;
export const AUTHORISE_FAILURE = false;

export type NetMessageType = "Authorise" | "Register";
export type NetMessageContext = { [name: string]: any };

export class NetMessage<_Type extends NetMessageType, _Ctx extends NetMessageContext> {
    readonly connection: NetConnection;
    readonly type: _Type;
    readonly context: _Ctx;

    constructor(conn: NetConnection, type: _Type, ctx: _Ctx) {
        this.connection = conn;
        this.type = type;
        this.context = ctx;
    }

    toJSON() {
        return NetMessage.toJSON(this.type, this.context);
    }

    static toJSON(type: NetMessageType, context: NetMessageContext) {
        return JSON.stringify({
            type: type,
            context: context
        });
    }

    static toObject<_Handler extends NetConnection>(conn: _Handler, data: string) {
        var msg: {
            type: NetMessageType,
            context: NetMessageContext
        } = JSON.parse(data);
        return new NetMessage(conn, msg.type, msg.context);
    }
}