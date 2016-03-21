import { toaster } from "./Toaster.js";

Toast.TYPE_INFO = "info";
Toast.TYPE_MESSAGE = "message";
Toast.TYPE_WARNING = "warning";
Toast.TYPE_ERROR = "error";
Toast.TYPE_DONE = "done";

Toast.TIME_SHORT = 2000;
Toast.TIME_NORMAL = 4000;
Toast.TIME_LONG = 8000;

/**
 * On-screen toast message.
 * @param {string} type - Toast.TYPE_*
 * @param {string} text
 * @param {number} [timeout]
 * @constructor
 */
export function Toast (type, text, timeout = Toast.TIME_NORMAL) {

    let el1 = document.createElement("div"),
        el2 = document.createElement("div");

    el1.className = "toast";
    el2.className = `body ${type}`;
    el1.appendChild(el2);
    el2.innerHTML = `${text}`;
    el1.style.opacity = 0;

    this.element = el1;
    this.position = 0;

    toaster.push(this, timeout);

}

/**
 * Attaches toast to GUI and return the height of the element.
 */
Toast.prototype.attach = function (position) {

    this.position = position;
    this.updateVisualPosition();
    document.body.appendChild(this.element);
    setTimeout(() => {
        this.element.style.opacity = 1;
    }, 0);

    return this.element.offsetHeight;

};

/**
 * Seek the toast message by Y coordinate.
 * @param delta
 */
Toast.prototype.seek = function (delta) {

    this.position += delta;
    this.updateVisualPosition();

};

/**
 * todo: upgrade to transform
 * @private
 */
Toast.prototype.updateVisualPosition = function () {

    this.element.style.bottom = this.position + "px";

};

Toast.prototype.detach = function () {

    let self = this;

    if (!this.element.parentNode) return;

    this.element.style.opacity = 0;
    setTimeout(() => {
        self.element.parentNode.removeChild(self.element);
    }, 300);

};