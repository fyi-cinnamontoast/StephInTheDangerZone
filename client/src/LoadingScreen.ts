// ==== Pixi / Graphics ====
import { AnimatedSprite, Application, Assets, Container, Text } from "pixi.js";
// ==== Cookies ====
import Cookies from "universal-cookie";
// ==== Networking ====
import { NetConnection } from "./networking/netconnection";
// ==== Screens ====
import Screen, { ScreenManager } from "./Screen";
import GameScreen from "./GameScreen";
import LoginScreen from "./LoginScreen";
// ==== Config ====
import config from "./config.json"

export default class LoadingScreen implements Screen {
    display(app: Application) {
        // Misc
        const cookies = new Cookies(null, { path: "/" });
        const net = NetConnection.connect(config.connection);
        const container = new Container();

        // Text
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

        // Centering everything on the screen
        app.ticker.add(() => {
            container.position.set(
                (app.view.width / 2),
                (app.view.height / 2)
            );
        });

        // Pinging the server
        net.open(() => {
            // If there is username and password saved go directly to game screen, otherwise login screen.
            if (cookies.get("username") && cookies.get("password"))
                ScreenManager.switch(new GameScreen());
            else
                ScreenManager.switch(new LoginScreen());
        })
        // Show error, if unable to connect
        net.error(() => {
            loadingText.text = "ERROR: OFFLINE";
            loadingText.style.fill = 0xAA0000;
        })
    }
}