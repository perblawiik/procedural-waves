/**
 * Author: Per Blåwiik
 * Date: 2019-12-29
 */

class Time {
    static init() {
        this._time = window.performance.now();
        this._deltaTime = 0.0;
    }

    static get now () {
        return window.performance.now();
    }

    static get deltaTime() {
        return this._deltaTime;
    }

    static get time() {
        return this._time;
    }

    static update() {
        this._deltaTime = window.performance.now() - this._time;
        this._time = window.performance.now();
    }
}

export default Time;