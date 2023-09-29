import { AnimatedSprite, Application, Assets, Graphics, Text } from "pixi.js";
import { Input } from "@pixi/ui"
import Page from "./page";
import PasswordInput from "./PasswordInput";
import RichButton from "./RichButton";
import { NetConnection } from "./networking/netconnection";

import config from "./config.json";

export default class LoginPage implements Page {
    display(app: Application): void {
        var net: NetConnection;
        // Background

        // UI
        var uiView = new Graphics();
        uiView.beginFill(0xFFFFFF, 0.75);
        uiView.drawRoundedRect(0, 0, 400, 600, 25);

        // Logo
        var logo = uiView.addChild(new AnimatedSprite(
            Assets.cache.get("assets/pack.json").animations["player_down"]
        ));
        logo.onFrameChange = (frame) => {
            var scale = 5;
            if (frame == 1)
                logo.scale.set(-scale, scale);
            else if (frame == 2)
                logo.scale.set(scale, scale);
        };
        logo.anchor.set(0.5, 0.5);
        logo.position.set(200, 32);
        logo.animationSpeed = 0.12;
        logo.play();

        // Username
        var usernameInput = uiView.addChild(new Input({
            bg: new Graphics()
                .beginFill(0xFFFFFF, 1)
                .drawRoundedRect(0, 0, 350, 40, 3),
            placeholder: "Enter Username...",
            maxLength: 32
        }));
        usernameInput.onChange.connect((text) => {
            if (!text.match(/^[a-zA-Z0-9_.]*$/))
                usernameInput.value = text.substring(0, text.length - 1);
        });
        usernameInput.position.set(25, 128);

        // Password
        var passwordInput = new PasswordInput({
            bg: new Graphics()
                .beginFill(0xFFFFFF, 1)
                .drawRoundedRect(0, 0, 350, 40, 3),
            placeholder: "Enter Password...",
            regex: /[a-zA-Z0-9_!@#$%^&*.]/,
            substitude: "*",
            maxLength: 32
        });
        uiView.addChild(passwordInput.view);
        passwordInput.view.position.set(25, 173);

        // Login Button
        var loginButton = new RichButton({
            rect: {
                width: 300, height: 40, radius: 4
            }
        });
        loginButton.view.position.set(50, 218);
        uiView.addChild(loginButton.view);

        loginButton.button.onDown.connect(() => {
            net.send("Authorise", {
                username: usernameInput.value,
                password: passwordInput.value
            });
        });

        var loginButtonText = new Text("Login", { 
            align: "left", 
            fontWeight: "bold"
        });
        loginButtonText.anchor.set(0.5, 0.5);
        loginButtonText.position.set(
            (loginButton.view.width / 2),
            (loginButton.view.height / 2)
        );
        loginButton.view.addChild(loginButtonText);

        // Register Button
        var registerButton = new RichButton({
            rect: {
                width: 300, height: 40, radius: 4
            }
        });
        registerButton.view.position.set(50, 263);
        uiView.addChild(registerButton.view);

        var registerButtonText = new Text("Register", { 
            align: "left",
            fontWeight: "bold" }
        );
        registerButtonText.anchor.set(0.5, 0.5);
        registerButtonText.position.set(
            (registerButton.view.width / 2),
            (registerButton.view.height / 2)
        );
        registerButton.view.addChild(registerButtonText);

        app.stage.addChild(uiView);

        // Net
        net = NetConnection.connect(config.connection);
        net.error(function() {
            loginButtonText.text = "OFFLINE";
            registerButtonText.text = "OFFLINE";

            (loginButton.view as Graphics)
                .clear()
                .beginFill(0x555555)
                .drawRoundedRect(0, 0, 300, 40, 4);

            (registerButton.view as Graphics)
                .clear()
                .beginFill(0x555555)
                .drawRoundedRect(0, 0, 300, 40, 4);

            loginButton.button.enabled = false;
            registerButton.button.enabled = false;
        })
        net.open(function() {
            console.log("ONLINE");
        });

        app.ticker.add(() => {
            uiView.position.set(
                (app.view.width / 2) - (uiView.width / 2),
                (app.view.height / 2) - (uiView.height / 2)
            );
        });
    }
}