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

};

AutoGrid.prototype.childExists = function (element) {

    return !!this.children.filter((e) => element === e.element).length;

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

};

AutoGrid.prototype.updateGrid = function () {

    let i, columnWidth = Math.floor(this.width/this.columns),
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

    for (i = 0; i < this.children.length; i++) {
        let block = this.children[i];
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
        // Adding/updating of nodes may cause scrollbar to appear. This changes the width of the
        // container. To prevent inset containers from flowing we need to recalculate sizes as
        // soon as we noticed size change. This won't take a lot of resources as not many cards
        // needed to trigger scrollbar appear.
        if (this.width !== this.container.offsetWidth) {
            this.updateSizes();
            return;
        }
    }

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