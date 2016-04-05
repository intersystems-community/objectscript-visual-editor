import { loadLevel, updateGrid } from "./index";
import { block, detach, awaitInlineInput } from "../domUtils";
import { enableItem } from "./card/item";
import { addChange } from "./changes";
import { Toast } from "../toast/index";

function getPropertyBlock (classData, classBlockName, classBlockPropName) {
    let div = block(`div`, `item`),
        prop = classData[classBlockName][classBlockPropName],
        item = block(`div`, `header`),
        iconBlock = block(`div`, `icons`),
        icon = block(`div`, `icon ${ prop["Private"] ? "private" : "public" }`),
        text = block(`span`, `label`),
        pName = block(`span`, `name`),
        type = prop["Type"] || prop["ReturnType"] || prop["MimeType"] || "",
        pTypeText = type ? block(`span`) : null,
        pType = type ? block(`span`, `type`) : null;
    iconBlock.appendChild(icon);
    item.appendChild(iconBlock);
    pName.textContent = prop["Name"];
    text.appendChild(pName);
    if (type) {
        pTypeText.textContent = ": ";
        text.appendChild(pTypeText);
        pType.textContent = type;
        text.appendChild(pType);
    }
    item.appendChild(text);
    enableItem({headerElement: item, classData, classBlockName, classBlockPropName});
    div.appendChild(item);
    return div;
}

function getControls (body, classData, classBlockName) {
    
    let controls = block(`div`, `controls`),
        add = block(`div`, `interactive normal icon add`);
    
    controls.appendChild(add);
    add.addEventListener(`click`, () => {
        awaitInlineInput(add, { placeholder: classBlockName }, (propName) => {
            let path = [classData[`Name`], classBlockName, propName];
            addChange(path.concat(`$add`), true);
            addChange(path.concat(`Name`), propName);
            classData[classBlockName][propName] = { Name: propName };
            body.appendChild(getPropertyBlock(classData, classBlockName, propName));
        });
    });
    
    return controls;
}

/**
 * Applies block markup according to class metadata.
 * @param {"Parameters"|"Properties"|"Methods"|"Queries"|"XDatas"|"Indices"} classBlockName
 * @param {*} classData - Class metadata.
 * @returns {Element}
 */
function getBlock (classBlockName, classData) {

    let section = block(`div`, `section`), body;
    //for (let classBlockPropName in classData[classBlockName]) {
    let header = block(`div`, `header`),
        span = block(`span`, `title`);
    body = block(`div`, `body`);
    header.appendChild(getControls(body, classData, classBlockName));
    header.appendChild(span);
    span.textContent = classBlockName;
    section.appendChild(header);
    section.appendChild(body);
        //break;
    //}
    for (let classBlockPropName in classData[classBlockName]) {
        body.appendChild(getPropertyBlock(classData, classBlockName, classBlockPropName));
    }
    return section;

}

/**
 * This function returns card element that may be applied to the grid.
 * @param {*} data
 * @returns {HTMLElement}
 */
export function getCardElement (data) {
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
        card.appendChild(getBlock("Parameters", data));
        card.appendChild(getBlock("Properties", data));
        card.appendChild(getBlock("Indices", data));
        card.appendChild(getBlock("Methods", data));
        card.appendChild(getBlock("Queries", data));
        card.appendChild(getBlock("XDatas", data));
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