export default class Logger {
    static handleWrite = function(msg: string) {
        console.log(msg)
    }

    static throwing(err?: Error) {
        this.handleWrite(`${ new Date(Date.now()).toLocaleString("en-US") } [ INFO ] ${err}`);
        return err;
    }

    static error(msg: string) {
        this.handleWrite(`${ new Date(Date.now()).toLocaleString("en-US") } [ ERROR ] ${msg}`);
    }

    static warn(msg: string) {
        this.handleWrite(`${ new Date(Date.now()).toLocaleString("en-US") } [ WARN ] ${msg}`);
    }

    static info(msg: string) {
        this.handleWrite(`${ new Date(Date.now()).toLocaleString("en-US") } [ INFO ] ${msg}`);
    }

    static trace(msg: string) {
        const e = new Error();
        const regex = /\((.*):(\d+):(\d+)\)$/;
        const match = regex.exec(e.stack.split("\n")[2]);
        var trace = {
            filepath: match[1].replace(/^.*[\\\/]/, ''),
            line: match[2]
        };
        this.handleWrite(`${ new Date(Date.now()).toLocaleString("en-US") } [ TRACE ] at "${trace.filepath}:${trace.line} ${msg}"`);
        
    }
}