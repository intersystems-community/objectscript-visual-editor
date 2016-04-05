import { block, awaitInlineInput } from "../../domUtils";
import { addChange } from "./../changes";
import { getMemberBlock } from "./member";

function getMemberControls (body, classData, classBlockName) {

    let controls = block(`div`, `controls`),
        add = block(`div`, `interactive normal icon add`);

    controls.appendChild(add);
    add.addEventListener(`click`, () => {
        awaitInlineInput(add, { placeholder: classBlockName }, (propName) => {
            let path = [classData[`Name`], classBlockName, propName];
            addChange(path.concat(`$add`), true);
            addChange(path.concat(`Name`), propName);
            classData[classBlockName][propName] = { Name: propName };
            body.appendChild(getMemberBlock(classData, classBlockName, propName));
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
export function getMemberSection (classBlockName, classData) {

    let section = block(`div`, `section`), body;
    //for (let classBlockPropName in classData[classBlockName]) {
    let header = block(`div`, `header`),
        span = block(`span`, `title`);
    body = block(`div`, `body`);
    header.appendChild(getMemberControls(body, classData, classBlockName));
    header.appendChild(span);
    span.textContent = classBlockName;
    section.appendChild(header);
    section.appendChild(body);
    //break;
    //}
    for (let classBlockPropName in classData[classBlockName]) {
        body.appendChild(getMemberBlock(classData, classBlockName, classBlockPropName));
    }
    return section;

}