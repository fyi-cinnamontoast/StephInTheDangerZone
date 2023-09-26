import { AnimatedSprite, Application, Assets, Graphics, Text } from "pixi.js";
import { Button, Input } from "@pixi/ui"
import Page from "./page";
import PasswordInput from "./PasswordInput";

export default class LoginPage implements Page {
    display(app: Application): void {
        // Background

        // UI
        var uiView = new Graphics()
        uiView.beginFill(0xFFFFFF, 0.75)
        uiView.drawRoundedRect(0, 0, 400, 600, 25)

        // Logo
        var logo = uiView.addChild(new AnimatedSprite(Assets.cache.get("assets/pack.json").animations["player_down"]))
        logo.onFrameChange = (frame) => {
            var scale = 5
            if (frame == 1)
                logo.scale.set(-scale, scale)
            else if (frame == 2)
                logo.scale.set(scale, scale)
        }
        logo.anchor.set(0.5, 0.5)
        logo.position.set(200, 32)
        logo.animationSpeed = 0.12;
        logo.play()

        // Username
        var usernameInput = uiView.addChild(new Input({
            bg: new Graphics()
                .beginFill(0xFFFFFF, 1)
                .drawRoundedRect(0, 0, 350, 40, 3),
            placeholder: "Enter Username...",
            maxLength: 32
        }))
        usernameInput.onChange.connect((text) => {
            if (!text.match(/^[a-zA-Z0-9_.]*$/))
                usernameInput.value = text.substring(0, text.length - 1)
        })
        usernameInput.position.set(25, 128)

        // Password
        var passwordInput = uiView.addChild(new PasswordInput({
            bg: new Graphics()
                .beginFill(0xFFFFFF, 1)
                .drawRoundedRect(0, 0, 350, 40, 3),
            placeholder: "Enter Password...",
            regex: /[a-zA-Z0-9_!@#$%^&*.]/,
            substitude: "*",
            maxLength: 32
        }))
        passwordInput.position.set(25, 173)

        // Login Button
        var loginButton = new Button(
            new Graphics()
                .beginFill(0xFFFFFF, 1)
                .drawRoundedRect(0, 0, 300, 40, 3)
        )
        loginButton.view.position.set(50, 218)
        uiView.addChild(loginButton.view)

        var loginButtonText = new Text("Login", { align: "left", fontWeight: "bold" })
        loginButtonText.anchor.set(0.5, 0.5)
        loginButtonText.position.set((loginButton.view.width / 2), loginButton.view.height / 2)
        loginButton.view.addChild(loginButtonText)

        // Register Button
        var registerButton = new Button(
            new Graphics()
                .beginFill(0xFFFFFF, 1)
                .drawRoundedRect(0, 0, 300, 40, 3)
        )
        registerButton.view.position.set(50, 263)
        uiView.addChild(registerButton.view)

        var registerButtonText = new Text("Register", { align: "left", fontWeight: "bold" })
        registerButtonText.anchor.set(0.5, 0.5)
        registerButtonText.position.set((registerButton.view.width / 2), registerButton.view.height / 2)
        registerButton.view.addChild(registerButtonText)

        app.stage.addChild(uiView)

        app.ticker.add(() => {
            uiView.position.set((app.view.width / 2) - (uiView.width / 2), (app.view.height / 2) - (uiView.height / 2))
        })
    }
}