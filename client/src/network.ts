export type NetMessageType = "Authorise" | "Register";
export class NetMessage<_Type extends NetMessageType, _T extends { [name: string]: any }> {
    get context() { return this._context; }
    get connection() { return this._conn; }

    private _context: _T & { [name: string]: any };
    private _conn: NetConnection;

    constructor(ctx: _T, conn: NetConnection) {
        this._context = { ...this, ...ctx };
        this._conn = conn;
    }
}

export type AUTHORISED = true;
export type AUTHORISE_ERROR = false;
export default class NetConnection {
    static get open() { return this._socket.readyState == WebSocket.OPEN; }

    private static _socket: WebSocket;

    private static _wantedMessage: {
        [type: string]: ((this: NetMessage<any, any>) => void)[]
    } = {  }
    private static _close: ((code: number, reason: string) => void)[] = [  ]
    private static _open: (() => void)[] = [  ]
    private static _error: (() => void)[] = [  ]

    static listen(url: string) {
        this._socket = new WebSocket(url);
        
        this._socket.onopen = (ev) => {
            this._open.forEach(cb => cb())
        }

        this._socket.onclose = (ev) => {
            this._close.forEach(cb => cb(ev.code, ev.reason))
        }

        this._socket.onerror = (ev) => {
            this._error.forEach(cb => cb())
        }

        this._socket.onmessage = (ev) => {
            var data = JSON.parse(ev.data) as {
                type: string,
                context: { [name: string]: any }
            };
            if (data.type in this._wantedMessage) {
                this._wantedMessage[data.type].forEach(
                    cb => cb.call(new NetMessage(data.context, this), this)
                );
            }
        }
    }

    static onerror(cb: () => void) { this._error.push(cb) }
    static onclosed(cb: (code: number, reason: string) => void) { this._close.push(cb) }
    static onopen(cb: () => void) { this._open.push(cb) }

    static on(type: "Authorise", cb: (this: NetMessage<"Authorise", { status: AUTHORISED | AUTHORISE_ERROR, authCode: string, err?: { code: number, msg: string } }>) => void): void;
    static on<_Type extends NetMessageType>(type: _Type, cb: (this: NetMessage<_Type, any>) => void): void {
        if (!this._wantedMessage[type])
            this._wantedMessage[type] = []
        this._wantedMessage[type].push(cb)
    }

    static send(type: "Authorise", ctx: { username: string, password: string }): void;
    static send(type: "Register", ctx: { username: string, password: string }): void;
    static send(type: NetMessageType, ctx: { [name: string]: any }): void {
        if (!this._socket)
            return;
        if (this.open) {
            this._socket.send(JSON.stringify({
                type: type,
                context: ctx
            }))
        }
    }
}