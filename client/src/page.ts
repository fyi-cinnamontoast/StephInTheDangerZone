import { Application, Container, DisplayObject } from "pixi.js";

export class PageManager {
    private static _app?: Application

    static init(app: Application) {
        this._app = app
    }

    static switch(page: Page) {
        if (this._app.stage.children.length > 0)
            this._app.stage.removeChildAt(0)
        page.display(this._app)
    }
}

export default interface Page {
    display(app: Application): void;
}