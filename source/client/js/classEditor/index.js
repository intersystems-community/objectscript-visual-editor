import { getList } from "../server";
import { AutoGrid } from "../autoGrid";
import { getCardElement } from "./card";

var PATH = "";

/**
 * @type {AutoGrid}
 */
let grid = null;

function orderData (data) {
    var sortable = [],
        sorted = {};
    for (var property in data)
        sortable.push([property, data[property]]);
    sortable.sort(([p1, d1], [p2, d2]) => {
        if (d1["_type"] === "package" && d2["_type"] !== "package") return -1;
        if (d2["_type"] === "package" && d1["_type"] !== "package") return 1;
        if (d1["ClassType"] !== d2["ClassType"]) return d1["ClassType"] > d2["ClassType"] ? 1 : -1;
        if (p1[0] === "%" && p2[0] !== "%") return -1;
        if (p2[0] === "%" && p1[0] !== "%") return 1;
        if (p1[0] === "%" && p2[0] === "%") return p1.substr(1) > p2.substr(1) ? 1 : -1;
        return p1 > p2 ? 1 : -1;
    });
    sortable.forEach(([p, v]) => sorted[p] = v);
    return sorted;
}

export function loadLevel (level) {
    PATH = level;
    grid.clear();
    getList("SAMPLES", PATH, (data) => {
        data = orderData(data);
        for (let obj in data) {
            grid.applyChild(getCardElement(data[obj]));
        }
    });

}

export function init () {

    grid = new AutoGrid(document.querySelector("#classBuilderBody"));

    loadLevel(PATH);

}
