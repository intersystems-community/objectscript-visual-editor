import { loadLevel } from "./index";
import { block } from "../utils";

function getPropertyBlock (prop) {
    let item = block(`div`, `item`),
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
    return item;
}

function getBlock (key, data) {

    let section = block(`div`, `section`), body, header;
    for (let prop in data[key]) {
        header = block(`div`, `header`);
        header.textContent = key;
        body = block(`div`, `body`);
        section.appendChild(header);
        section.appendChild(body);
        break;
    }
    for (let prop in data[key]) {
        body.appendChild(getPropertyBlock(data[key][prop]));
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