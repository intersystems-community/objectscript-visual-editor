import { block, insertAfter, clearSelection } from "../../domUtils";
import { updateGrid } from "../index";
import { addChange } from "../changes";

/**
 * Creates and returns interactive class block property editor.
 * @param data
 * @param classData
 * @param classBlockName
 * @param classBlockPropName
 * @returns {Element}
 */
function createView (data, classData, classBlockName, classBlockPropName) {
    let container = block(`div`, `detailed`),
        comment = block(`div`, `comment`);
    container.appendChild(comment);
    comment.setAttribute("contenteditable", "true");
    comment.addEventListener("input", () => {
        addChange(
            [classData["Name"], classBlockName, classBlockPropName, "Description"],
            comment.innerHTML.replace(/<br\s*\/?>/, "<br/>\n")
        );
    });
    if (data["Description"])
        comment.textContent = data["Description"];
    return container;
}

/**
 * Enables block item interactivity.
 * @param {HTMLElement} element
 * @param {*} classData
 * @param classBlockName
 * @param classBlockPropName
 */
export function enableItem (element, classData, classBlockName, classBlockPropName) {

    let data = classData[classBlockName][classBlockPropName],
        opened = false,
        container;

    element.addEventListener("click", () => {
        if (!container) container = createView(data, classData, classBlockName, classBlockPropName);
        if (opened = !opened) {
            insertAfter(container, element);
        } else if (container.parentNode) {
            container.parentNode.removeChild(container);
            clearSelection();
        }
        updateGrid();
    });

}