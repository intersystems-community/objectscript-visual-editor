import { loadLevel } from "./index";
import { block } from "../domUtils";
import { enableItem } from "./card/item";

function getPropertyBlock (classData, classBlockName, classBlockPropName) {
    let prop = classData[classBlockName][classBlockPropName],
        item = block(`div`, `header`),
        icon = block(`div`, `icon ${ prop["Private"] ? "private" : "public" }`),
        text = block(`span`, `label`),
        pName = block(`span`, `name`),
        type = prop["Type"] || prop["ReturnType"] || prop["MimeType"] || "",
        pTypeText = type ? block(`span`) : null,
        pType = type ? block(`span`, `type`) : null;
    item.appendChild(icon);
    pName.textContent = prop["Name"];
    text.appendChild(pName);
    if (type) {
        pTypeText.textContent = ": ";
        text.appendChild(pTypeText);
        pType.textContent = type;
        text.appendChild(pType);
    }
    item.appendChild(text);
    enableItem(item, classData, classBlockName, classBlockPropName);
    return item;
}

/**
 * Applies block markup according to class metadata.
 * @param {"Parameters"|"Properties"|"Methods"|"Queries"|"XDatas"|"Indices"} classBlockName
 * @param {*} classData - Class metadata.
 * @returns {Element}
 */
function getBlock (classBlockName, classData) {

    let section = block(`div`, `section`), body, header;
    for (let classBlockPropName in classData[classBlockName]) {
        header = block(`div`, `header`);
        header.textContent = classBlockName;
        body = block(`div`, `body`);
        section.appendChild(header);
        section.appendChild(body);
        break;
    }
    for (let classBlockPropName in classData[classBlockName]) {
        let div = block(`div`, `item`);
        div.appendChild(getPropertyBlock(classData, classBlockName, classBlockPropName));
        body.appendChild(div);
    }
    return section;

}

/**
 * This function returns card element that may be applied to the grid.
 * @param {*} data
 * @returns {HTMLElement}
 */
export function getCardElement (data) {
    let card = block(`div`, `card ${ data["_type"] }`),
        head = block(`div`, `head`),
        headIcon = block(`div`, `cardIcon ${ data["ClassType"] || "" }`),
        header = block(`div`, `header`);

    header.textContent = data["name"];
    head.appendChild(headIcon);
    head.appendChild(header);
    card.appendChild(head);
    //enableItem(head, data);

    card.appendChild(getBlock("Parameters", data));
    card.appendChild(getBlock("Properties", data));
    card.appendChild(getBlock("Indices", data));
    card.appendChild(getBlock("Methods", data));
    card.appendChild(getBlock("Queries", data));
    card.appendChild(getBlock("XDatas", data));

    if (data["_type"] === "package") {
        card.addEventListener("click", () => {
            loadLevel(data["fullName"]);
        });
        return card;
    }

    return card;
}