import { block, insertAfter, clearSelection, prepend, detach, freeSelect } from "../../domUtils";
import { updateGrid } from "../index";
import { addChange } from "../changes";
import { Toast } from "../../toast";
import { getKeywordView } from "./keyword";
import MANIFEST from "./MANIFEST";
import { MEMBER_SECTIONS, getMemberSection } from "./memberSection";

/**
 * Creates and returns interactive class block property editor.
 * @param classData
 * @param [classBlockName]
 * @param [classBlockPropName]
 * @returns {Element}
 */
function getMemberDetailedBlock (classData, classBlockName, classBlockPropName) {

    let isClass = !classBlockName,
        data = isClass ? classData : classData[classBlockName][classBlockPropName],
        container = block(`div`, `detailed`),
        comment = block(`div`, `comment`),
        savePath = isClass
            ? [classData["Name"]]
            : [classData["Name"], classBlockName, classBlockPropName];

    container.appendChild(comment);
    comment.setAttribute("contenteditable", "true");
    comment.addEventListener("input", () => {
        addChange(
            [classData["Name"], classBlockName, classBlockPropName, "Description"],
            comment.innerHTML.replace(/<br\s*\/?>/, "<br/>\n")
        );
    });
    if (data["Description"])
        comment.innerHTML = data["Description"];
    comment.setAttribute("placeholder", "< Add comment >");
    for (let propName in data) {
        let propManifest = (MANIFEST[isClass ? "Class" : classBlockName] || {})[propName] || {};
        if (propManifest.ignore || propManifest.default === data[propName]) continue;
        if (typeof data[propName] === "object") continue;
        container.appendChild(getKeywordView({
            propManifest, propName, propData: data[propName], savePath
        }));
    }

    return container;

}

/**
 * Enables block item interactivity.
 * This method combines behaviors for class and class members.
 * @param {HTMLElement} headerElement
 * @param {*} classData
 * @param [classBlockName]
 * @param [classBlockPropName]
 * @param [classBlockElement]
 */
function enableMember ({
    headerElement, classData, classBlockName, classBlockPropName, classBlockElement
}) {
    
    let isClass = !classBlockName,
        opened = false,
        container, controls,
        savePath = isClass
            ? [classData["Name"]]
            : [classData["Name"], classBlockName, classBlockPropName];

    headerElement.addEventListener(`click`, () => {
        if (!container) {

            container = isClass
                ? getMemberDetailedBlock(classData)
                : getMemberDetailedBlock(classData, classBlockName, classBlockPropName);
            controls = block(`div`, `controls`);

            let add = block(`select`, `interactive normal icon add hidden-select`),
                del = block(`div`, `interactive normal icon delete`);

            freeSelect(add);
            controls.appendChild(add);
            controls.appendChild(del);

            add.addEventListener(`mousedown`, () => { // form the list of not present properties

                while (add.firstChild)
                    add.removeChild(add.firstChild);

                if (isClass) {
                    MEMBER_SECTIONS.forEach(mName => {
                        let end = false;
                        [].slice.call(classBlockElement.childNodes).forEach(n => {
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
                }

                let propsManifest = MANIFEST[isClass ? "Class" : classBlockName] || {},
                    presentProps = {};
                [].forEach.call(container.childNodes, (node) => {
                    if (node.PROPERTY_NAME) presentProps[node.PROPERTY_NAME] = 1;
                });
                for (let propName in propsManifest) {
                    if (propsManifest[propName].ignore) continue;
                    if (presentProps.hasOwnProperty(propName)) continue;
                    let opt = block(`option`);
                    opt.textContent = propName;
                    opt.value = propName;
                    add.appendChild(opt);
                }

            });
            add.addEventListener(`click`, e => e.stopPropagation());
            add.addEventListener(`change`, (e) => {

                let propName = (e.target || e.srcElement).value,
                    propManifest =
                        (MANIFEST[isClass ? "Class" : classBlockName] || {})[propName] || {};

                if (isClass && MEMBER_SECTIONS.indexOf(propName) !== -1) {
                    classBlockElement.appendChild(getMemberSection(propName, classData));
                    return;
                }

                container.appendChild(getKeywordView({
                    propManifest: propManifest,
                    propName: propName,
                    propData: propManifest.default || "",
                    savePath: savePath
                }));

            });

            let lastTimeDelClicked = 0;
            del.addEventListener(`click`, e => e.stopPropagation());
            del.addEventListener(`click`, () => {
                let delta = (-lastTimeDelClicked + (lastTimeDelClicked = (new Date()).getTime()));
                if (delta > 5000) { // > 5 sec - show message "click again to delete"
                    new Toast(Toast.TYPE_INFO, `Click again to delete`);
                } else { // delete
                    addChange(savePath.concat(`$delete`), true);
                    detach(headerElement);
                    detach(container);
                    if (classBlockElement)
                        detach(classBlockElement);
                }
            });
        }
        if (opened = !opened) {
            insertAfter(container, headerElement);
            prepend(controls, headerElement);
        } else if (container.parentNode) {
            container.parentNode.removeChild(container);
            controls.parentNode.removeChild(controls);
            clearSelection();
        }
        updateGrid();
    });

}

function getMemberIconsBlock (isClass, memberData) {

    let iconsBlock = block(`div`, `icons`);

    if (!isClass)
        iconsBlock.appendChild(
            block(`div`, `icon ${ memberData["Private"] ? "private" : "public" }`)
        );

    return iconsBlock;

}

/**
 * @param classData
 * @param [classBlockName]
 * @param [classBlockPropName]
 * @param {HTMLElement} classBlockElement
 * @returns {HTMLElement}
 */
export function getMemberBlock ({
    classData, classBlockName, classBlockPropName, classBlockElement
}) {

    let isClass = !classBlockName,
        div = block(`div`, `item`),
        prop = isClass ? classData : classData[classBlockName][classBlockPropName],
        item = block(`div`, `header`),
        text = block(`span`, `label`),
        pName = block(`span`, `name`),
        type = prop["Type"] || prop["ReturnType"] || prop["MimeType"] || "",
        pTypeText = type ? block(`span`) : null,
        pType = type ? block(`span`, `type`) : null;

    pName.textContent = prop["name"] || prop["Name"];
    item.appendChild(getMemberIconsBlock(isClass, prop));
    text.appendChild(pName);
    if (type) {
        pTypeText.textContent = ": ";
        text.appendChild(pTypeText);
        pType.textContent = type;
        text.appendChild(pType);
    }
    item.appendChild(text);
    enableMember({
        headerElement: item, classData, classBlockName, classBlockPropName, classBlockElement
    });
    div.appendChild(item);

    return div;
}