import { WebSocketServer } from "ws";
import { NetHandler } from "./nethandler";
import { createServer } from "http";
import { NetMessageContext, NetMessageType } from "./netmessage";

export class NetServer {
    private _server?: WebSocketServer;
    private _clients: Set<NetHandler> = new Set();

    private _onconnection: ((this: NetHandler, server: NetServer) => void)[] = [];

    connection(cb: (this: NetHandler, server: NetServer) => void) {
        this._onconnection.push(cb);
    }

    listen(url: string, port: number) {
        var http = createServer().listen(port, url);
        this._server = new WebSocketServer({
            server: http
        });

        this._server.on("connection", 
            socket => this._onconnection.forEach(
                cb => {
                    var conn = new NetHandler(socket);
                    this._clients.add(conn);
                    cb.call(conn, this);
                }
            )
        );
    }

    send(type: NetMessageType, context: NetMessageContext): void;
    send(type: "FatalError", context: { code: number, msg?: string }): void;
    send(type: "Authorise", context: { username: string, password: string }): void;
    send(type: "Register", context: { username: string, password: string }): void;
    send(type: "ChatMessage", context: { username: string, message: string, hash: string }) : void;
    send(type: NetMessageType, context: NetMessageContext) {
        this._clients.forEach(client => client.send(type, context))
    }
}