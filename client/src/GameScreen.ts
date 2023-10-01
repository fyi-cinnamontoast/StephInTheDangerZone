// ==== Pixi / Graphics ====
import { Application, Graphics } from 'pixi.js';
import { Input } from '@pixi/ui';
// ==== Cookies ====
import Cookies from 'universal-cookie';
// ==== Networking ====
import { NetConnection } from './networking/netconnection';
import Hash from './networking/hash';
// ==== Screens
import Screen, { ScreenManager } from './Screen';
import LoadingScreen from './LoadingScreen';
// ==== Config ====
import config from "./config.json";

export default class GameScreen implements Screen {
    private net: NetConnection;
    private app: Application

    display(app: Application) {
        this.app = app;

        /* ==== Misc ==== */
        var _this = this
        const cookies = new Cookies(null, { path: "/" });

        /* NetConnection */
        this.net = NetConnection.connect(config.connection);
        this.net.error(function() {
            ScreenManager.switch(new LoadingScreen())
        });
        this.net.open(() => {
            this.net.send("Authorise", { 
                username: cookies.get("username"),
                password: cookies.get("password")
            });
        });

        this.net.on("Authorise", function() {
            if (this.context.status) {
                _this.drawWorld();
                _this.drawUI();

                return;
            }

            // Erase cookies and go back to loading screen, if an authorise error
            cookies.remove("username");
            cookies.remove("password");

            ScreenManager.switch(new LoadingScreen());
        });
    }

    drawUI() {
            /* ==== UI ==== */
            // Chat
            const background = new Graphics()
                .beginFill(0xBBBBBB, 0.75)
                .drawRoundedRect(0, 0, 500, 400, 10);
            
            const chatInput = background.addChild(new Input({
                bg: new Graphics()
                    .beginFill(0xFFFFFF, 0.75)
                    .drawRoundedRect(0, 0, 490, 25, 4),
                maxLength: 120
            }));
            chatInput.position.set(5, 5);
            chatInput.onEnter.connect((value) => {
                this.net.send("ChatMessage", {
                    message: value,
                    hash: Hash.string(value)
                });
            });

            background.addChild(chatInput);
            this.app.stage.addChild(background);
    }

    drawWorld() {

    }
}