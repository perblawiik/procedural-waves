/**
 * Author: Per Blåwiik
 * Date: 2019-12-29
 */

class ConnectionManager {

    static init() {
        this.items = new Map();
        this.signalPending = false;
        this.message = "";
    }

    static registerItem(tag, value) {
        this.items.set(tag, value);
    }

    static setItemValue (tag, value) {
        this.items.set(tag, value);
    }

    static getItemValue(tag) {
        return this.items.get(tag);
    }

    static sendSignal(message) {
        this.signalPending = true;
        this.message = message;
    }

    static resetSignal() {
        this.signalPending = false;
        this.message = "";
    }
}

export default ConnectionManager;
