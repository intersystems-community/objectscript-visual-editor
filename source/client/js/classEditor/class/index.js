import { loadLevel, updateGrid } from "./../index";
import { block, detach, freeSelect } from "../../domUtils";
import { getMemberSection, MEMBER_SECTIONS } from "./memberSection";
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
        del = block(`div`, `interactive normal icon delete`),
        add = block(`select`, `interactive normal icon add hidden-select`),
        headIcon = block(`div`, `cardIcon ${ data["ClassType"] || "" }`),
        header = block(`div`, `header`);

    header.textContent = data["name"];
    if (type === "class") // float priority
        head.appendChild(controls);
    head.appendChild(headIcon);
    head.appendChild(header);
    card.appendChild(head);

    if (type === "package") {
        card.addEventListener("click", () => {
            loadLevel(data["fullName"]);
        });
        return card;
    }

    MEMBER_SECTIONS.forEach(mName => {
        if (data[mName] && Object.keys(data[mName]).length)
            card.appendChild(getMemberSection(mName, data));
    });

    controls.appendChild(add);
    freeSelect(add);
    add.addEventListener(`mousedown`, () => { // form the list of not present member sections
        while (add.firstChild)
            add.removeChild(add.firstChild);
        MEMBER_SECTIONS.forEach(mName => {
            let end = false;
            [].slice.call(card.childNodes).forEach(n => {
                if (n.SECTION_NAME === mName)
                    end = true;
            });
            if (end)
                return;
            let opt = block(`option`);
            opt.textContent = mName;
            opt.value = mName;
            add.appendChild(opt);
        });
    });
    add.addEventListener(`change`, (e) => {
        let memberSectionName = (e.target || e.srcElement).value;
        card.appendChild(getMemberSection(memberSectionName, data));
    });

    let lastTimeDelClicked = 0;
    controls.appendChild(del);
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