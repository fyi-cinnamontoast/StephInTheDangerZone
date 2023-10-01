// ==== Pixi / Graphics ====
import { Application, Assets, BaseTexture, SCALE_MODES } from "pixi.js";
// ==== Screens ====
import { ScreenManager } from "./Screen";
import LoadingScreen from "./LoadingScreen";

// Create and add PIXI Application
BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST;
let app = new Application<HTMLCanvasElement>({
    resizeTo: window
});
document.body.appendChild(app.view);

// Initialize page manager
ScreenManager.init(app);

// Load Spritesheet and then start execution
Assets.load("assets/pack.json").then(() => {
    ScreenManager.switch(new LoadingScreen());
});