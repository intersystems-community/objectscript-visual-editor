import { save } from "../server";
import { changeIsMade } from "./index";

let changes = {};

/**
 * Adds a change to pending changes.
 * @param path - ["ClassName", "properties", "PropName", "ParamName"]
 * @param value
 */
export function addChange (path = [], value) {
    let obj = changes,
        prop = path.pop();
    path.forEach((p) => obj = obj[p] || (() => obj[p] = {})() );
    obj[prop] = value;
    changeIsMade();
}

export function saveChanges (namespace, callback) {
    save(namespace, changes, (res) => {

        if (!res["error"])
            changes = {};

        callback(res);

    });
}