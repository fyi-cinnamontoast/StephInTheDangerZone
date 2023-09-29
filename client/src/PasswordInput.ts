import { Input, InputOptions } from "@pixi/ui";
import { Container } from "pixi.js";

export default class PasswordInput {
    get value() { return this._value; }
    get view() { return this._input; }

    private _input: Input;

    private _value: string = "";
    private _regex: RegExp;
    private _substitude?: string;

    constructor(options: InputOptions & { regex: RegExp, substitude: string }) {
        this._input = new Input(options as InputOptions);
        this._substitude = options.substitude;
        this._regex = options.regex;

        this._input.onChange.connect((text) => {
            if (text.length - 1 / this._substitude.length < this._value.length) {
                this._value = this._value.substring(0, this._value.length - 1);
            }
            else if (text[text.length - 1].match(this._regex)) {
                this._value += text[text.length - 1];
            }
            this._input.value = this._substitude.repeat(this._value.length);
        })
    }
}