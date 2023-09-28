import { Application, Assets, BaseTexture, SCALE_MODES } from "pixi.js";
import config from "./config.json";
import { NetConnection } from "./networking/netconnection";
import Page, { PageManager } from "./page";
import LoginPage from "./LoginPage";

// Create and add PIXI Application
BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST
let app = new Application<HTMLCanvasElement>({
    resizeTo: window
})
document.body.appendChild(app.view)

PageManager.init(app)

// Create connection
var net = NetConnection.connect(config.connection)

// On Authorise Response
net.on("Authorise", function() {
    if (this.context.status) {
        console.log("Logged In")
    } else {
        console.log(this.context.err)
    }
})

// On open
net.open(() => {
    // Send Register Request
    net.send("Register", {
        username: "sizakuma",
        password: "163271234",
    })
})

// Load Spritesheet and then start execution
Assets.load("assets/pack.json").then(() => {
    PageManager.switch(new LoginPage())
})