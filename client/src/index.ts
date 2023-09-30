import { Application, Assets, BaseTexture, HTMLText, SCALE_MODES } from "pixi.js";
import { PageManager } from "./page";

import LoadingPage from "./LoadingPage";

// Create and add PIXI Application
BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST;
let app = new Application<HTMLCanvasElement>({
    resizeTo: window
});
document.body.appendChild(app.view);

// Initialize page manager
PageManager.init(app);

// Load Spritesheet and then start execution
Assets.load("assets/pack.json").then(() => {
    PageManager.switch(new LoadingPage());
});