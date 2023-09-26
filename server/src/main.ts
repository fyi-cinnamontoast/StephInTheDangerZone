import { NetServer } from "networking/netserver";

var server = new NetServer()

server.connection(function() {
    this.on("Authorise", function() {
        console.log("Authorise", this.context.username)
        this.connection.send("Authorise", { status: true })
    })
})

server.listen("localhost", 8000)