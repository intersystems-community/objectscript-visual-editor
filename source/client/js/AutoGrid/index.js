/**
 * AutoGrid - responsive, adaptive automatic layout that just works for you. Everything you have to
 * do is to create AutoGrid instance with argument of container element, and AutoGrid will align
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
    this.COLUMNS = getColumnsNumber(this.width);

    /**
     * This array holds sorted grid elements. Container is a wrapper for the element.
     * @type {{ element: HTMLElement, container: HTMLElement, [width]: number=1 }[]}
     */
    this.children = [];

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
 * Removes all children.
 */
AutoGrid.prototype.clear = function () {
    this.children = this.children.filter(({ container }) => {
        if (container.parentNode)
            container.parentNode.removeChild(container);
        return false;
    });
};

/**
 * This function disables AutoGrid automatic layout.
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

/**
 * @param {HTMLElement} element
 * @param {*} [options] - Additional options like { width: 2 }.
 */
AutoGrid.prototype.applyChild = function (element, options) {

    if (this.childExists(element)) return;

    let container = document.createElement("div"),
        obj = {
            element: element,
            container: container,
            width: 1
        };

    container.className = "AutoGrid-container";
    container.style.position = "absolute";
    container.appendChild(element);
    Object.assign(obj, options || {});

    this.children.push(obj);

    this.updateGrid();

};

/**
 * @param {HTMLElement} element
 * @param {*} options - Additional options like { width: 2 }.
 * @returns {boolean} - Success of update (if the element is found).
 */
AutoGrid.prototype.updateChild = function (element, options) {

    let updated = null;

    this.children.forEach(c => {
        if (c !== element)
            return;
        updated = c;
    });

    if (updated) {
        Object.assign(updated, options);
        this.updateGrid();
    }

    return !!updated;

};

AutoGrid.prototype.updateGrid = function () {

    let i, columnWidth = Math.floor(this.width / this.COLUMNS),
        columnHeights = (() => {
            let arr = [], i;
            for (i = 0; i < this.COLUMNS; i++)
                arr.push(0);
            return arr;
        })();

    /**
     * WIDTH = 3
     * C1 C2 C3 C4 C5
     * ## ## ## ## ##
     * ## ##    ##
     * ##       ##
     * (______) ##
     *
     * This function returns sorted array of column indices to fill the grid.
     */
    function getNextColumnIndices (colSpan) {
        let iArr = Array.from({ length: columnHeights.length }, (v, k) => k).sort((i1, i2) => {
                if (columnHeights[i1] === columnHeights[i2])
                    return 0;
                return columnHeights[i1] > columnHeights[i2] ? 1 : -1;
            }), rArr;
        for (let i = colSpan; i <= iArr.length; i++) {
            rArr = iArr.slice(0, i).sort();
            let c = 1, u;
            for (u = 1; u < rArr.length; u++)
                if (rArr[u - 1] + 1 === rArr[u]) {
                    if (++c === colSpan) {
                        u++;
                        break;
                    }
                } else {
                    c = 1;
                }
            if (c === colSpan) {
                rArr = rArr.slice(u - colSpan, u);
                break;
            }
        }
        return rArr ? rArr : Array.from({ length: columnHeights.length }, (v, k) => k);
    }

    for (i = 0; i < this.children.length; i++) {

        let block = this.children[i];
        let colSpan = Math.min(block.width || 1, this.COLUMNS),
            colIndices = getNextColumnIndices(colSpan),
            minTop = Math.max.apply(Math, colIndices.map(i => columnHeights[i])),
            left = colIndices[0] * columnWidth + "px",
            top = minTop + "px";

        if (!block.container.parentNode) {
            block.container.style.left = left;
            block.container.style.top = top;
            block.container.style.width = columnWidth * colSpan + "px";
            this.container.appendChild(block.container);
        } else {
            if (block.container.style.left !== left)
                block.container.style.left = left;
            if (block.container.style.top !== top)
                block.container.style.top = top;
            if (block.container.style.width !== columnWidth + "px")
                block.container.style.width = columnWidth * colSpan + "px";
        }

        colIndices.forEach(index => {
            columnHeights[index] = minTop + block.container.offsetHeight;
        });

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

    // Yet another check required in case the height of the block is reduced and scrollbar
    // disappears.
    if (this.width !== this.container.offsetWidth) {
        this.updateSizes();
    }

};

AutoGrid.prototype.updateSizes = function () {

    if (this.width === this.container.offsetWidth) return;

    this.width = this.container.offsetWidth;
    this.COLUMNS = getColumnsNumber(this.width);

    this.updateGrid();

};