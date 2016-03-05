/**
 * AutoGrid - responsive, adaptive automatic layout that just works for you. Everything you have to
 * do is to create AutoGrid instance with argument of container element, and AutoGrid will do
 * the best layout for you.
 * NOTE. AutoGrid will turn container's position to relative and overflow to auto.
 * @author Nikita Savchenko aka ZitRo (zitros.lab@gmail.com)
 * @param {HTMLElement} container - Block that contains blocks to align.
 */
export function AutoGrid (container) {

    if (!(container instanceof HTMLElement))
        throw new Error(`container (${container}) is not HTML element.`);

    container.style.position = "relative";

    this.container = container;
    this.width = container.offsetWidth;
    this.columns = getColumnsNumber(this.width);

    /**
     * This array holds sorted grid elements. Container is a wrapper for the element.
     * @type {{ element: HTMLElement, container: HTMLElement }[]}
     */
    this.children = [

    ];

    let resizeTimer = 0; // not to perform resize too frequently
    this.windowResizeHandler = () => {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => this.updateSizes(), 200);
    };
    window.addEventListener("resize", this.windowResizeHandler);

    if (!window.MutationObserver) {
        this.observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type !== "childList") return;
                mutation.addedNodes.forEach(() => this.childApplied);
                mutation.addedNodes.forEach(() => this.childRemoved);
            });
        });
        this.observer.observe(this.container, { childList: true });
    } else { // old browsers support
        this.container.addEventListener("DOMNodeInserted", this.nodeInsertListener = (ev) => {
            this.childApplied(ev.target || ev.srcElement);
        }, false);
        this.container.addEventListener("DOMNodeRemoved", this.nodeRemoveListener = (ev) => {
            this.childApplied(ev.target || ev.srcElement);
        }, false);
    }

}

function getColumnsNumber (width) {
    return Math.max(1, Math.round(width / 400));
}

/**
 * This function disables AutoGrid.
 */
AutoGrid.prototype.disable = function () {

    if (!this.windowResizeHandler) return;

    window.removeEventListener("resize", this.windowResizeHandler);
    this.windowResizeHandler = null;
    this.container = null;
    if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
    } else if (this.nodeInsertListener && this.nodeRemoveListener) {
        this.container.removeEventListener("DOMNodeInserted", this.nodeInsertListener);
        this.container.removeEventListener("DOMNodeRemoved", this.nodeRemoveListener);
    }

};

AutoGrid.prototype.childExists = function (element) {

    return !!this.children.filter((e) => element === e.element).length;

};

/**
 * Child applied to the DOM via "applyChild" native method.
 * @param element
 */
AutoGrid.prototype.childApplied = function (element) {

};

/**
 * Child removed from the DOM via "removeChild" native method.
 * @param element
 */
AutoGrid.prototype.childRemoved = function (element) {

};

AutoGrid.prototype.applyChild = function (element) {

    if (this.childExists(element)) return;

    let container = document.createElement("div");
    container.style.position = "absolute";
    container.appendChild(element);
    this.children.push({
        element: element,
        container: container
    });

    this.updateGrid();
    if (this.width !== this.container.offsetWidth) this.updateSizes();

};

AutoGrid.prototype.updateGrid = function () {

    let columnWidth = Math.floor(this.width/this.columns),
        columnHeights = (() => {
            let arr = [], i;
            for (i = 0; i < this.columns; i++)
                arr.push(0);
            return arr;
        })();

    function getNextColumnIndex () {
        let i, minCol = 0, minHeight = columnHeights[0];
        for (i = 1; i < columnHeights.length; i++)
            if (columnHeights[i] < minHeight) {
                minCol = i;
                minHeight = columnHeights[minCol];
            }
        return minCol;
    }

    this.children.forEach((block) => {
        console.log(this.container.offsetWidth);
        let colIndex = getNextColumnIndex(),
            left = colIndex * columnWidth + "px",
            top = columnHeights[colIndex] + "px";
        if (!block.container.parentNode) {
            block.container.style.left = left;
            block.container.style.top = top;
            block.container.style.width = columnWidth + "px";
            this.container.appendChild(block.container);
        } else {
            if (block.container.style.left !== left)
                block.container.style.left = left;
            if (block.container.style.top !== top)
                block.container.style.top = top;
            if (block.container.style.width !== columnWidth + "px")
                block.container.style.width = columnWidth + "px";
        }
        columnHeights[colIndex] += block.container.offsetHeight;
    });

    this.container.style.height = columnHeights.reduce((a, b) => Math.max(a, b)) + "px";

};

AutoGrid.prototype.updateSizes = function () {

    console.log("Size update");

    if (this.width === this.container.offsetWidth) return;

    let newWidth = this.container.offsetWidth,
        newCols = getColumnsNumber(newWidth);

    this.width = newWidth;

    //if (newCols === this.columns) return;
    console.log("OK");

    this.columns = newCols;

    this.updateGrid();

};