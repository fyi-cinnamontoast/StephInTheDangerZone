import { NetMessage, NetMessageType, NetMessageContext, AUTHORISE_FAILURE, AUTHORISE_SUCCESS } from "./netmessage"

export class NetConnection {
    get socket() { return this._socket; }

    private _socket: WebSocket;

    private _wanted: {
        [name: string]: ((this: NetMessage<any, NetMessageContext>) => void)[]
    } = {  };
    private _open: ((this: NetConnection) => void)[] = [ ];
    private _closed: ((this: NetConnection) => void)[] = [ ];
    private _error: ((this: NetConnection) => void)[] = [ ];

    constructor(socket: WebSocket) {
        this._socket = socket;
        this._socket.onmessage = (ev) => {
            var msg = NetMessage.toObject(this, ev.data.toString());
            if (msg.type in this._wanted)
                this._wanted[msg.type].forEach(cb => cb.call(msg));
        }
        this._socket.onopen = (ev) => {
            this._open.forEach(cb => cb.call(this));
        }
        this._socket.onclose = (ev) => {
            this._closed.forEach(cb => cb.call(this));
        }
        this._socket.onerror = (ev) => {
            this._error.forEach(cb => cb.call(this));
        }
    }

    open(cb: (this: NetConnection) => void) {
        this._open.push(cb);
        if (this._socket.readyState == WebSocket.OPEN)
            cb.call(this);
    }

    closed(cb: (this: NetConnection) => void) {
        this._closed.push(cb);
        if (this._socket.readyState == WebSocket.CLOSED)
            cb.call(this);
    }

    error(cb: (this: NetConnection) => void) {
        this._error.push(cb);
        if (this._socket.readyState == WebSocket.CLOSED)
            cb.call(this);
    }

    close() {
        this._socket.close();
    }

    send(type: NetMessageType, context: NetMessageContext): void;
    send(type: "Authorise", context: { username: string, password: string }): void;
    send(type: "Register", context: { username: string, password: string }): void;
    send(type: "ChatMessage", context: { message: string, hash: string }): void;
    send(type: NetMessageType, context: NetMessageContext) {
        if (this._socket.readyState == WebSocket.OPEN)
            this._socket.send(NetMessage.toJSON(type, context));
    }

    on(type: "FatalError", cb: (this: NetMessage<"FatalError", { code: number, msg?: string }>) => void): void;
    on(type: "Authorise", cb: (this: NetMessage<"Authorise", { status: typeof AUTHORISE_SUCCESS | typeof AUTHORISE_FAILURE, err?: { code: number, msg: string } }>) => void): void;
    on(type: "Register", cb: (this: NetMessage<"Register", { status: typeof AUTHORISE_SUCCESS | typeof AUTHORISE_FAILURE, err?: { code: number, msg: string } }>) => void): void;
    on(type: "ChatMessage", cb: (this: NetMessage<"ChatMessage", { username: string, message: string, hash: string }>) => void) : void;
    on(type: "ChatMessage", cb: (this: NetMessage<"ChatMessage", { username: string, err?: { code: number, msg: string } }>) => void) : void;
    on<_Type extends NetMessageType>(type: _Type, cb: (this: NetMessage<_Type, NetMessageContext>) => void) {
        if (!this._wanted[type])
            this._wanted[type] = [];
        this._wanted[type].push(cb);
    }

    static connect(url: string, port?: number) {
        return new NetConnection(new WebSocket(port ? `ws://${url}:${port}` : url));
    }
}