import { Application, Assets, BaseTexture, SCALE_MODES } from "pixi.js";
import { NetConnection } from "./networking/netconnection";
import { PageManager } from "./page";
import LoginPage from "./LoginPage";

import config from "./config.json";

// Create and add PIXI Application
BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST;
let app = new Application<HTMLCanvasElement>({
    resizeTo: window
});
document.body.appendChild(app.view);

// Initialize page manager
PageManager.init(app);

var net = NetConnection.connect(config.connection);

// Load Spritesheet and then start execution
Assets.load("assets/pack.json").then((value) => {
    net.open(() => {
        PageManager.switch(new LoginPage());
    });
});