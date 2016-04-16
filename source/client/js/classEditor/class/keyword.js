import { block, toggle } from "../../domUtils";
import { addChange } from "../changes";

function getKeywordEditElement (propName, value, propManifest, savePath) {
    let type = propManifest["type"] || "string",
        input;
    if (type === "boolean") {
        input = toggle(!!value);
        input.checkbox.addEventListener(`change`, () => addChange(
            savePath,
            input.checkbox.checked ? 1 : 0
        ));
    } else if (type === "string") { // string type
        input = block(`input`);
        input.type = "text";
        input.value = value;
        input.addEventListener(`input`, () => addChange(
            savePath,
            input.value
        ));
    } else if (type === "select") selBlock: {

        let options = propManifest["options"];

        if (!(options instanceof Array)) {
            input = block(`div`, `errorMessage`, `No "options" specified for type "select".`);
            break selBlock;
        }

        input = block(`select`);
        options.forEach(opt => {
            let el = block(`option`),
                cbValue = typeof opt === "object" && opt["value"] ? opt["value"] : opt;
            el.textContent = typeof opt === "object" && opt["label"] ? opt["label"] : opt;
            el.value = cbValue;
            input.appendChild(el);
            if (cbValue == value)
                input.value = cbValue;
        });

        input.addEventListener(`change`, () => addChange(
            savePath,
            input.value
        ));

    } else {
        input = block(`div`, `errorMessage`);
        input.textContent = `Unknown type "${ type }"`;
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