import * as sqlite from "sqlite3"
import Config from "./config";

export class Database {
    private _conn: sqlite.Database;

    private constructor(conn: sqlite.Database) {
        this._conn = conn;

        this._conn.exec("CREATE TABLE IF NOT EXISTS clients(username TEXT PRIMARY KEY, password TEXT NOT NULL);");
        this._conn.exec("CREATE TABLE IF NOT EXISTS scoreboard(username TEXT PRIMARY KEY, score INTEGER NOT NULL);");
        this._conn.exec("CREATE TABLE IF NOT EXISTS save(entity TEXT PRIMARY KEY, value NOT NULL);");
    }

    static open(filename: string) {
        return new Database(new sqlite.Database(filename));
    }
}