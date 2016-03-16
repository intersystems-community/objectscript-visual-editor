import { getList } from "../server";
import { AutoGrid } from "../autoGrid";
import { getCardElement } from "./card";
import { block } from "../utils";

var PATH = "",
    INITIALIZED = false,
    NAMESPACE = "";

let initCallbacks = [];

/**
 * @type {AutoGrid}
 */
let grid = onInit(() => grid = new AutoGrid(document.querySelector("#classBuilderBody")));

/**
 * @type {HTMLElement}
 */
let backButton = onInit(() => {
        backButton = document.querySelector("#backButton");
        backButton.addEventListener("click", () => {
            if (PATH === "") return;
            loadLevel(PATH.replace(/\.?[^\.]+$/, ""));
        });
    }),
    topNamespace = onInit((data) => {
        topNamespace = document.querySelector("#topNamespace");
        while (topNamespace.firstChild)
            topNamespace.removeChild(topNamespace.firstChild);
        for (let ns in data["namespaces"]) {
            let c = block("option", "", ns);
            c.setAttribute("value", ns);
            if (ns === data["namespace"]) c.setAttribute("selected", "true");
            topNamespace.appendChild(c);
        }
        updateHeaderNamespaceWidth(NAMESPACE);
        topNamespace.addEventListener("change", (e) => {
            NAMESPACE = (e.target || e.srcElement).value;
            updateHeaderNamespaceWidth(NAMESPACE);
            loadLevel("");
        });
    });

/**
 * This function uses a bit of trick to compute the width of the namespace element in header, but it
 * does its job.
 * @param {string} namespace
 */
function updateHeaderNamespaceWidth (namespace) {
    let temp = block("select", "topNamespace"),
        t2 = block("option");
    t2.setAttribute("selected", "true");
    t2.textContent = namespace;
    temp.appendChild(t2);
    topNamespace.parentNode.appendChild(temp);
    topNamespace.style.width = temp.offsetWidth + "px";
    topNamespace.parentNode.removeChild(temp);
}

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

function setTitle (text) {
    document.querySelector("#topTitle").textContent = text;
}

/**
 * This namespace should be trusted - setting wrong namespace will result as "no data".
 */
function setNamespace (namespace) {
    topNamespace.textContent = namespace;
}

export function loadLevel (level) {

    PATH = level;
    grid.clear();

    if (PATH === "")
        backButton.style.display = "none";
    setTitle(`${ PATH ? "." : "" }${ PATH }`);

    getList(NAMESPACE, PATH, (data) => {
        grid.clear();
        if (PATH !== "")
            backButton.style.display = "";
        data = orderData(data);
        for (let obj in data) {
            grid.applyChild(getCardElement(data[obj]));
        }
    });

}

export function onInit (callback) {
    if (typeof callback !== "function") throw new Error(`onInit requires function`);
    if (INITIALIZED)
        callback();
    else
        initCallbacks.push(callback);
    return "Duck";
}

export function init (data) {

    INITIALIZED = true;
    NAMESPACE = data["namespace"];
    initCallbacks.forEach(cb => cb(data));
    initCallbacks = [];

    loadLevel(PATH);

}
