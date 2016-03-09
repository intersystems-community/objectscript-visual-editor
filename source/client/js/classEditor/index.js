import { getList } from "../server";
import { AutoGrid } from "../autoGrid";
import { getCardElement } from "./card";

var PATH = "";

/**
 * @type {AutoGrid}
 */
let grid = null;

export function loadLevel (level) {

    PATH = level;
    grid.clear();
    getList("SAMPLES", PATH, (data) => {
        for (let obj in data) {
            grid.applyChild(getCardElement(data[obj]));
        }
    });

}

export function init () {

    grid = new AutoGrid(document.querySelector("#classBuilderBody"));

    loadLevel(PATH);

}
