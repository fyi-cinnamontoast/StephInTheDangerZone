import path from "path";
import Config from "./config";
import { Database } from "./db";
import Logger from "./logger";
import { NetServer } from "./networking/netserver";
import { createInterface } from "readline";
import * as crypto from "crypto";
import Filter from "bad-words";
import Hash from "./networking/hash";

// Open database and config
const config = Config.load();
var db: Database = Database.open(
    path.join(__dirname, config.sqlite.filename)
);

const filter = new Filter();

var server = new NetServer();

Logger.info("Listening...");
server.connection(function() {
    var username: string;

    // On client connection
    Logger.info("New connection...");
    
    this.on("Authorise", function() {
        // On Authorise Request
        console.log("Authorise", this.context.username);
        username = this.context.username;
        this.connection.send("Authorise", { status: true });
    });

    this.on("Register", function() {
        // On Register Request
        console.log("Register", this.context.username);
        username = this.context.username;
        this.connection.send("Authorise", { status: true });
    });

    this.on("ChatMessage", function() {
        // On Chat Messsage
        Logger.info(`${ username } : ${ this.context.message }`);
        // Check the CheckSum
        if (this.context.hash != Hash.string(this.context.message))
            return this.connection.send("ChatMessage", { 
                username: username,
                err: {
                    code: 422,
                    msg: "CheckSum Failure"
                }
            })
        // Clean message of bad words
        var cleanMessage = filter.clean(this.context.message);
        server.send("ChatMessage", {
            username: username,
            message: cleanMessage,
            hash: Hash.string(cleanMessage)
        });
    })
});

// Listen to connections
server.listen(config.connection.host, config.connection.port);