import { loadLevel } from "./../index";
import { block } from "../../domUtils";
import { getMemberSection, MEMBER_SECTIONS } from "./memberSection";
import { getMemberBlock } from "./member";

/**
 * This function returns card element that may be applied to the grid.
 * @param {*} data
 * @returns {HTMLElement}
 */
export function getClassElement (data) {

    let type = data["_type"],
        card = block(`div`, `card ${ type }`),
        head = block(`div`, `head`),
        controls = block(`div`, `controls`),
        headIcon = block(`div`, `cardIcon ${
            data["_compiledClassType"] || data["ClassType"] || ""
        }`),
        header = block(`div`, `header`);

    if (type === "class") // float priority
        head.appendChild(controls);
    head.appendChild(headIcon);
    card.appendChild(head);

    if (type === "package") {
        header.textContent = data["_name"];
        head.appendChild(header);
        card.addEventListener("click", () => {
            loadLevel(data["_fullName"]);
        });
        return card;
    }

    head.appendChild(getMemberBlock({ classData: data, classBlockElement: card }));
    MEMBER_SECTIONS.forEach(mName => {
        if (data[mName] && Object.keys(data[mName]).length)
            card.appendChild(getMemberSection(mName, data));
    });

    return card;
}