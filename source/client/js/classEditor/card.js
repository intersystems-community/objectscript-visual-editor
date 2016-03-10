import { loadLevel } from "./index";

function block (className, element = "div") {
    let el = document.createElement(element);
    el.className = className;
    return el;
}

function getContainer (prop) {
    let item = block(`item`),
        icon = block(`icon public`),
        text = block(`label`, `span`);
    item.appendChild(icon);
    text.textContent = `${ prop["Name"] }: ${ prop["Type"] }`;
    item.appendChild(text);
    return item;
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

    let section, body;
    for (let prop in data["Properties"]) {
        section = block(`section`);
        header = block(`header`);
        header.textContent = "Properties";
        body = block(`body`);
        section.appendChild(header);
        section.appendChild(body);
        card.appendChild(section);
        break;
    }
    for (let prop in data["Properties"]) {
        section.appendChild(getContainer(data["Properties"][prop]));
    }

    if (data["_type"] === "package") {
        card.addEventListener("click", () => {
            loadLevel(data["fullName"]);
        });
        return card;
    }

    return card;
}