import { loadLevel, updateGrid } from "./../index";
import { block, detach } from "../../domUtils";
import { getMemberSection } from "./memberSection";
import { addChange } from "./../changes";
import { Toast } from "../../toast/index";

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
        del = block(`div`, `interactive medium icon delete`),
        headIcon = block(`div`, `cardIcon ${ data["ClassType"] || "" }`),
        header = block(`div`, `header`);

    header.textContent = data["name"];
    controls.appendChild(del);
    if (type === "class")
        head.appendChild(controls);
    head.appendChild(headIcon);
    head.appendChild(header);
    card.appendChild(head);

    if (type === "class") {
        card.appendChild(getMemberSection("Parameters", data));
        card.appendChild(getMemberSection("Properties", data));
        card.appendChild(getMemberSection("Indices", data));
        card.appendChild(getMemberSection("Methods", data));
        card.appendChild(getMemberSection("Queries", data));
        card.appendChild(getMemberSection("XDatas", data));
    } else if (type === "package") {
        card.addEventListener("click", () => {
            loadLevel(data["fullName"]);
        });
        return card;
    }

    let lastTimeDelClicked = 0;
    del.addEventListener(`click`, e => e.stopPropagation());
    del.addEventListener(`click`, () => {
        let delta = (-lastTimeDelClicked + (lastTimeDelClicked = (new Date()).getTime()));
        if (delta > 5000) { // > 5 sec - show message "click again to delete"
            new Toast(Toast.TYPE_INFO, `Click again to delete`);
        } else { // delete
            addChange([data["Name"]].concat(`$delete`), true);
            detach(card);
            updateGrid();
        }
    });

    return card;
}