import * as ws from "ws"
import { NetMessage, NetMessageType, NetMessageContext, AUTHORISE_FAILURE, AUTHORISE_SUCCESS } from "./netmessage"

export class NetConnection {
    get socket() { return this._socket }

    private _socket: WebSocket

    private _wanted: {
        [name: string]: ((this: NetMessage<NetConnection, any, NetMessageContext>) => void)[]
    } = {  }

    constructor(socket: WebSocket) {
        this._socket = socket
        this._socket.onmessage = (ev) => {
            var msg = NetMessage.toObject(this, ev.data.toString())
            if (msg.type in this._wanted) {
                this._wanted[msg.type].forEach(cb => cb.call(msg))
            }
        }
    }

    send(type: NetMessageType, context: NetMessageContext): void;
    send(type: "Authorise", context: { username: string, password: string }): void;
    send(type: "Register", context: { username: string, password: string }): void;
    send(type: NetMessageType, context: NetMessageContext) {
        this._socket.send(NetMessage.toJSON(type, context))
    }

    on<_Type extends NetMessageType>(type: _Type, cb: (this: NetMessage<NetConnection, _Type, NetMessageContext>) => void): void;
    on(type: "Authorise", cb: (this: NetMessage<NetConnection, "Authorise", { status: typeof AUTHORISE_SUCCESS | typeof AUTHORISE_FAILURE, err?: { code: number, msg: string } }>) => void): void;
    on(type: "Register", cb: (this: NetMessage<NetConnection, "Register", { status: typeof AUTHORISE_SUCCESS | typeof AUTHORISE_FAILURE, err?: { code: number, msg: string } }>) => void): void;
    on<_Type extends NetMessageType>(type: _Type, cb: (this: NetMessage<NetConnection, _Type, NetMessageContext>) => void) {
        if (!this._wanted[type])
            this._wanted[type] = []
        this._wanted[type].push(cb)
    }

    static connect(url: string, port?: number) {
        return new NetConnection(new WebSocket(port ? `ws://${url}:${port}` : url))
    }
}