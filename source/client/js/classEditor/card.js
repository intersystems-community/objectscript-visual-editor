import { loadLevel } from "./index";

function block (className, element = "div") {
    let el = document.createElement(element);
    el.className = className;
    return el;
}

function getPropertyBlock (prop) {
    let item = block(`item`),
        icon = block(`icon ${ prop["Private"] ? "private" : "public" }`),
        text = block(`label`, `span`),
        pName = block(`name`, `span`),
        type = prop["Type"] || prop["ReturnType"] || prop["MimeType"] || "",
        pTypeText = type ? block("", "span") : null,
        pType = type ? block(`type`, `span`) : null;
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

    let section = block(`section`), body, header;
    for (let prop in data[key]) {
        header = block(`header`);
        header.textContent = key;
        body = block(`body`);
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
    let card = block(`card ${ data["_type"] }`),
        head = block(`head`),
        headIcon = block(`cardIcon ${ data["ClassType"] || "" }`),
        header = block(`header`);

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