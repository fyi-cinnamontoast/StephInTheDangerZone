import { WebSocket } from "ws";
import { NetMessage, NetMessageType, NetMessageContext, AUTHORISE_FAILURE, AUTHORISE_SUCCESS } from "./netmessage";

export class NetHandler {
    get socket() { return this._socket; }

    private _socket: WebSocket;

    private _wanted: {
        [name: string]: ((this: NetMessage<any, NetMessageContext>) => void)[]
    } = {  };

    constructor(socket: WebSocket) {
        this._socket = socket;
        this._socket.on("message", (data) => {
            var msg = NetMessage.toObject(this, data.toString());
            if (msg.type in this._wanted)
                this._wanted[msg.type].forEach(cb => cb.call(msg));
        })
    }

    send(type: NetMessageType, context: NetMessageContext): void;
    send(type: "Authorise", context: { status: typeof AUTHORISE_SUCCESS | typeof AUTHORISE_FAILURE, err?: { code: number, msg: string } }): void;
    send(type: "Register", context: { status: typeof AUTHORISE_SUCCESS | typeof AUTHORISE_FAILURE, err?: { code: number, msg: string } }): void;
    send(type: NetMessageType, context: NetMessageContext) {
        if (this._socket.readyState == WebSocket.OPEN)
            this._socket.send(NetMessage.toJSON(type, context));
    }

    on<_Type extends NetMessageType>(type: _Type, cb: (this: NetMessage<_Type, NetMessageContext>) => void): void;
    on(type: "Authorise", cb: (this: NetMessage<"Authorise", { username: string, password: string }>) => void): void;
    on(type: "Register", cb: (this: NetMessage<"Register", { username: string, password: string }>) => void): void;
    on<_Type extends NetMessageType>(type: _Type, cb: (this: NetMessage<_Type, NetMessageContext>) => void) {
        if (!this._wanted[type])
            this._wanted[type] = [];
        this._wanted[type].push(cb);
    }
}
