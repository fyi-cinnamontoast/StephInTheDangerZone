import { Application, Assets, BaseTexture, SCALE_MODES } from "pixi.js";
import FontFaceObserver from "fontfaceobserver";
import config from "./config.json";
import NetConnection, { NetMessage } from "./network";
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
NetConnection.listen(config.connection)

// Send Register Request
NetConnection.send("Register", {
    username: "sizakuma",
    password: "163271234",
})

// On Authorise Response
NetConnection.on("Authorise", function() {
    if (this.context.status) {
        console.log("Logged In")
    } else {
        console.log(this.context.err)
    }
})

// Load Spritesheet and then start execution
Assets.load("assets/pack.json").then(() => {
    PageManager.switch(new LoginPage())
})