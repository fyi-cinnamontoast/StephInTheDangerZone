import { AnimatedSprite, Application, Assets, Container, ICanvas, Text } from "pixi.js";
import Page, { PageManager } from "./page";
import { NetConnection } from "./networking/netconnection";
import Cookies from "universal-cookie";

import config from "./config.json"
import GamePage from "./GamePage";
import LoginPage from "./LoginPage";

export default class LoadingPage implements Page {
    display(app: Application) {
        const cookies = new Cookies(null, { path: "/" });
        const net = NetConnection.connect(config.connection);
        const container = new Container();

        var loadingText = container.addChild(new Text("Loading...", {
            dropShadow: true,
            dropShadowColor: 0x000000,
            dropShadowAlpha: 0.75,
            fontSize: 20,
            fill: 0xFFFFFF,
            align: "center",

        }));
        loadingText.anchor.set(0.5, 0.5);
        loadingText.position.set(0, 192);

        // Logo
        var logo = container.addChild(new AnimatedSprite(
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
        logo.position.set(0, 32);
        logo.animationSpeed = 0.12;
        logo.play();

        app.stage.addChild(container);

        app.ticker.add(() => {
            container.position.set(
                (app.view.width / 2),
                (app.view.height / 2)
            );
        });

        net.open(() => {
            if (cookies.get("username") && cookies.get("password"))
                PageManager.switch(new GamePage());
            else
                PageManager.switch(new LoginPage());
        })
        net.error(() => {
            loadingText.text = "ERROR: OFFLINE";
            loadingText.style.fill = 0xAA0000;
        })
    }
}