import * as fs from "fs"
import path from "path"

export default class Config {
    private static default = {
        connection: {
            host: "127.0.0.1",
            port: 8000
        },
        sqlite: {
            filename: "server.db"
        }
    }

    private static _loaded?: typeof Config.default

    static load() {
        if (this._loaded)
            return this._loaded;

        const conf = path.join(__dirname, "config.json")
        if (!fs.existsSync(conf)) {
            fs.writeFileSync(conf, JSON.stringify(Config.default, undefined, 4))
            this._loaded = Config.default;
        }
        else {
            this._loaded = JSON.parse(fs.readFileSync(conf, { encoding: "utf-8" })) as {
                connection: {
                    host: string,
                    port: number
                },
                sqlite: {
                    filename: string
                }
            }
        }
        return this._loaded;
    }
}