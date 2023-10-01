import { Application } from "pixi.js";

export class ScreenManager {
    private static _app?: Application;

    static init(app: Application) {
        this._app = app;
    }

    static switch(page: Screen) {
        if (this._app.stage.children.length > 0)
            this._app.stage.removeChildAt(0);
        page.display(this._app);
    }
}

export default interface Screen {
    display(app: Application): void;
}