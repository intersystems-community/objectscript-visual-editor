import { getList } from "../server";
import { AutoGrid } from "../autoGrid";
import { getCardElement } from "./card";
import { block, awaitInlineInput, freeSelect, waitApplyProperty } from "../domUtils";
import { saveChanges } from "./changes";
import { Toast } from "../toast";
import { addChange } from "./changes";

var PATH = "",
    INITIALIZED = false,
    NAMESPACE = "";

let initCallbacks = [];

/**
 * @type {AutoGrid}
 */
let grid = onInit(() => grid = new AutoGrid(document.querySelector("#classBuilderBody")));

/**
 * Function which updates current grid.
 */
export function updateGrid () {
    grid.updateGrid();
}

/**
 * Behaviors for elements on page.
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
            if (ns === NAMESPACE) c.setAttribute("selected", "true");
            topNamespace.appendChild(c);
        }
        updateHeaderNamespaceWidth(NAMESPACE);
        topNamespace.addEventListener("change", (e) => {
            setNamespace((e.target || e.srcElement).value);
            updateHeaderNamespaceWidth(NAMESPACE);
            loadLevel("");
        });
    }),
    saveButton = onInit(() => {
        saveButton = document.querySelector("#saveIndicator");
        saveButton.addEventListener("click", () => {
            saveChanges(NAMESPACE, (res) => {
                if (!res["error"]) {
                    changeIsMade(false);
                    new Toast(Toast.TYPE_DONE, `Saved!`);
                } else {
                    new Toast(Toast.TYPE_ERROR, res["error"]);
                }
            });
        });
    }),
    addClassPackageButton = onInit(() => {
        addClassPackageButton = document.querySelector("#addClass");
        freeSelect(addClassPackageButton);
        addClassPackageButton.addEventListener(`change`, () => {
            
            let type = addClassPackageButton["value"]; // "class" || "package"
            
            awaitInlineInput(addClassPackageButton, {
                placeholder: `Enter ${ type } name...`
            }, (name) => {
                
                let fullName = `${ PATH ? PATH + "." : "" }${ name }`,
                    setup = {
                        _type: type,
                        name: name,
                        Name: fullName,
                        Properties: {},
                        Methods: {},
                        Queries: {},
                        Parameters: {},
                        Indices: {}
                    };
                
                if (type === "class") {
                    setup["ClassType"] = "registered";
                } else {
                    setup["fullName"] = fullName;
                }
                
                grid.applyChild(getCardElement(setup));
                
                if (type !== "package")
                    addChange([fullName, "$add"], true);
                
            });
        });
    });

/**
 * Get the location hash parameter value.
 * @param {string} name - Parameter name.
 * @returns {string|undefined}
 */
export function getURLHashParameter (name) {
    let eName = encodeURIComponent(name),
        arr = location.hash.substr(1).split("&").filter(keyVal => keyVal.split("=")[0] === eName);
    if (!arr.length) return undefined;
    return decodeURIComponent(arr[0].split("=")[1] || "");
}

/**
 * Set the location hash parameter value.
 * @param {string} name - Parameter name.
 * @param {string|undefined} [value] - If no value provided, then URL parameter will be removed.
 */
export function setURLHashParameter (name, value) {
    let eName = encodeURIComponent(name);
    if (getURLHashParameter(name) === undefined) {
        if (typeof value === "undefined") return;
        location.hash += `${ location.hash.length > 1 ? "&" : "" }${
                encodeURIComponent(name)
            }${ value ? `=${ encodeURIComponent(value) }` : `` }`;
    } else {
        location.hash = "#" + location.hash.substr(1).split("&").map((keyVal) => {
                let kv = keyVal.split("=");
                return (kv[0] === eName)
                    ? typeof value === "undefined"
                        ? ""
                        : `${ kv[0] }=${ encodeURIComponent(value) }`
                    : keyVal;
            }).filter(e => e !== "").join("&");
    }
}

/**
 * This function sets the namespace. Note that namespace should be a valid namespace that exists.
 * @param {string} namespace
 */
export function setNamespace (namespace) {
    NAMESPACE = namespace;
    setURLHashParameter("namespace", NAMESPACE);
}

/**
 * This function applies visual effects regarding to changes were made and
 * indicates that changes are needed to be saved.
 * @param {boolean} update
 */
export function changeIsMade (update) {
    if (update) {
        saveButton.style.opacity = 0;
        saveButton.style.display = "inline-block";
        setTimeout(() => saveButton.style.opacity = 1, 1);
    } else {
        saveButton.style.opacity = 0;
        setTimeout(() => saveButton.style.display = "none", 300);
    }
}

/**
 * This function uses a bit of trick to compute the width of the namespace element in header.
 * @param {string} namespace - Currently selected namespace.
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
 * Displays the classes and packages located on the current level.
 * @param {string} level - Class part.
 */
export function loadLevel (level) {

    PATH = level;
    grid.clear();

    if (PATH === "")
        backButton.style.display = "none";
    setTitle(`${ PATH ? "." : "" }${ PATH }`);

    setURLHashParameter("level", PATH || undefined);

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
    if (typeof callback !== "function") throw new Error(`onInit requires a function`);
    if (INITIALIZED)
        callback();
    else
        initCallbacks.push(callback);
    return "Duck"; // Property has to be redefined in onInit callback.
}

/**
 * Application entry point.
 * @param {*} data - Server response to the /Informer/init request.
 */
export function init (data) {

    INITIALIZED = true;
    setNamespace(getURLHashParameter("namespace") || data["namespace"]);
    initCallbacks.forEach(cb => cb(data));
    initCallbacks = [];

    loadLevel(getURLHashParameter("level") || "");

}
