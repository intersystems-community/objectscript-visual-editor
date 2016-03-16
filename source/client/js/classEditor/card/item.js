import { block, insertAfter, clearSelection } from "../../utils";
import { updateGrid } from "../index";

function createView (data) {
    let container = block(`div`, `detailed`),
        comment = block(`div`, `comment`);
    container.appendChild(comment);
    comment.setAttribute("contenteditable", "true");
    if (data["Description"])
        comment.textContent = data["Description"];
    return container;
}

export function enableItem (element, data) {

    let opened = false,
        container;

    element.addEventListener("click", () => {
        if (!container) container = createView(data);
        if (opened = !opened) {
            insertAfter(container, element);
        } else if (container.parentNode) {
            container.parentNode.removeChild(container);
            clearSelection();
        }
        updateGrid();
    });

}