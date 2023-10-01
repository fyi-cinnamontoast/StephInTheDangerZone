import { createHash } from "crypto"

export default class Hash {
    static string(str: string) {
        return createHash("base512")
                .update(str)
                .digest("base64")
    }
}