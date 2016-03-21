import { Toast } from "./index";

/**
 * @type {Toaster}
 */
export var toaster = new Toaster();

/**
 * Toasts controller. Toast is the message that appears on the screen for a little while. It is
 * useful for showing info messages.
 * @constructor
 */
function Toaster () {

    /**
     * @type {Toast[]}
     */
    this.toasts = [];

}

/**
 * @param {Toast} toast
 * @param {number} timeout
 */
Toaster.prototype.push = function (toast, timeout) {

    let height = toast.attach(0),
        self = this;

    this.toasts.forEach((toast) => {
        toast.seek(height);
    });
    this.toasts.push(toast);

    setTimeout(() => {
        self.toasts.splice(0, 1)[0].detach();
    }, timeout);

};