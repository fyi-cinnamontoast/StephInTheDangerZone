import { Button } from "@pixi/ui";
import { ColorSource, Graphics } from "pixi.js";

export default class RichButton {
    get view() { return this._button.view; }
    get button() { return this._button; }

    private _button: Button;

    constructor(options: {
        rect: {
            width: number, height: number, radius?: number
        }, 
        unpressed?: { 
            color: ColorSource,
            alpha?: number
        },
        pressed?: { 
            color: ColorSource,
            alpha?: number
        }
    }) {
        this._button = new Button(new Graphics()
            .beginFill(
                options.unpressed?.color ?? 0xFFFFFF,
                options.pressed?.alpha ?? 1
            )
            .drawRoundedRect(
                0, 0, 
                options.rect.width, 
                options.rect.height, 
                options.rect.radius ?? 0
            )
        );

        this._button.onDown.connect((btn, e) => {
            (btn.view as Graphics)
                .clear()
                .beginFill(
                    options.pressed?.color ?? 0xAAAAAA,
                    options.pressed?.alpha ?? 1
                )
                .drawRoundedRect(
                    0, 0, 
                    options.rect.width,
                    options.rect.height,
                    options.rect.radius ?? 0
                );
        });

        this._button.onUp.connect((btn, e) => {
            (btn.view as Graphics)
                .clear()
                .beginFill(
                    options.unpressed?.color ?? 0xAAAAAA,
                    options.unpressed?.alpha ?? 1
                )
                .drawRoundedRect(
                    0, 0, 
                    options.rect.width,
                    options.rect.height,
                    options.rect.radius ?? 0
                );
        });
    }
}