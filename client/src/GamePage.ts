import { Application, Graphics } from 'pixi.js';
import Page from './page';
import { Input } from '@pixi/ui';
import { NetConnection } from './networking/netconnection';
import Config from '../../server/src/config';
import { createHash } from 'crypto';

import config from "./config.json";
import Cookies from 'universal-cookie';

export default class GamePage implements Page {
    display(app: Application) {
        /* ==== Misc ==== */
        const cookies = new Cookies(null, { path: "/" });
        const hash = createHash("sha512");
        function hashString(str: string) {
            hash.update(str);
            return hash.digest("base64");
        }

        /* NetConnection */
        var net = NetConnection.connect(config.connection);
        net.open(() => {
            net.send("Authorise", { 
                username: cookies.get("username"),
                password: cookies.get("password")
            })
        })
        net.on("Authorise", function() {
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
            }))
            chatInput.position.set(5, 5);
            chatInput.onEnter.connect((value) => {
                net.send("ChatMessage", {
                    message: value,
                    hash: hashString(value)
                });
            })

            background.addChild(chatInput);
            app.stage.addChild(background);
        })
    }
}