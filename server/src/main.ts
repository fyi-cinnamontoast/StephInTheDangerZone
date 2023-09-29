import Logger from "./logger";
import { NetServer } from "./networking/netserver";

var server = new NetServer();

Logger.info("Listening...");
server.connection(function() {
    Logger.info("Net connection...");
    
    this.on("Authorise", function() {
        console.log("Authorise", this.context.username);
        this.connection.send("Authorise", { status: true });
    });

    this.on("Register", function() {
        console.log("Register", this.context.username);
        this.connection.send("Authorise", { status: true });
    });
});

server.listen("127.0.0.1", 8000);