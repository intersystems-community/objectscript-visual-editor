import { block } from "../../domUtils";
import { addChange } from "../changes";

function getKeywordEditElement (propName, value, propManifest, savePath) {
    let type = propManifest["type"] || "string",
        input;
    if (type === "boolean") {
        input = block(`input`, `toggle`);
        input.type = "checkbox";
        input.checked = !!value;
        input.addEventListener(`change`, () => addChange(
            savePath.concat(propName),
            input.checked ? 1 : 0
        ));
    } else { // string type
        input = block(`input`);
        input.type = "text";
        input.value = value;
        input.addEventListener(`input`, () => addChange(
            savePath.concat(propName),
            input.value
        ));
    }
    return input;
}

export function getKeywordView ({ propManifest, propName, propData, savePath }) {
    let propBlock = block(`div`, `property-block`),
        propNameBlock = block(`div`, `name-block`),
        propEdit = block(`div`, `value-block`);
    propNameBlock.textContent = propName;
    if (propManifest.required) propNameBlock.classList.add(`required`);
    propEdit.appendChild(getKeywordEditElement(propName, propData, propManifest, savePath));
    propBlock.appendChild(propNameBlock);
    propBlock.appendChild(propEdit);
    propBlock.PROPERTY_NAME = propName;
    return propBlock;
}