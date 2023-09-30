import { NetHandler } from "./nethandler";

export const AUTHORISE_SUCCESS = true;
export const AUTHORISE_FAILURE = false;

export type NetMessageType = "FatalError" | "Authorise" | "Register" | "ChatMessage";
export type NetMessageContext = { [name: string]: any };

export class NetMessage<_Type extends NetMessageType, _Ctx extends NetMessageContext> {
    readonly connection: NetHandler;
    readonly type: _Type;
    readonly context: _Ctx;

    constructor(conn: NetHandler, type: _Type, ctx: _Ctx) {
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

    static toObject<_Handler extends NetHandler>(conn: _Handler, data: string) {
        var msg: {
            type: NetMessageType,
            context: NetMessageContext
        } = JSON.parse(data);
        return new NetMessage(conn, msg.type, msg.context);
    }
}