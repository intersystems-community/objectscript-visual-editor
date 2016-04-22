import { block, awaitInlineInput } from "../../domUtils";
import { addChange } from "./../changes";
import { getMemberBlock } from "./member";
import { updateGrid } from "./../index";

export const MEMBER_SECTIONS = [
    "Parameters",
    "Properties",
    "Indices",
    "Methods",
    "Queries",
    "XDatas"
];

function getMemberControls (body, classData, classBlockName, serviceData) {

    let controls = block(`div`, `controls`),
        add = block(`div`, `interactive normal icon add`);

    controls.appendChild(add);
    add.addEventListener(`click`, () => {
        controls.style.opacity = 1;
        awaitInlineInput(add, { placeholder: classBlockName }, (cancelled, propName) => {

            controls.style.opacity = "";
            
            if (cancelled)
                return;
            
            let path = [classData[`Name`], classBlockName, propName];

            addChange(path.concat(`$add`), true);
            addChange(path.concat(`Name`), propName);

            classData[classBlockName][propName] = { Name: propName };
            body.appendChild(getMemberBlock({
                classData, classBlockName, classBlockPropName: propName, serviceData
            }));

            updateGrid();

        });
    });

    return controls;
    
}

/**
 * Applies block markup according to class metadata.
 * @param {"Parameters"|"Properties"|"Methods"|"Queries"|"XDatas"|"Indices"} classBlockName
 * @param {*} classData - Class metadata.
 * @param {*} [serviceData] - Object with additional properties passed through all the members.
 * @returns {Element}
 */
export function getMemberSection (classBlockName, classData, serviceData) {

    let section = block(`div`, `section`), body;

    section.SECTION_NAME = classBlockName;

    let header = block(`div`, `header`),
        span = block(`span`, `title`);
    body = block(`div`, `body`);
    header.appendChild(getMemberControls(body, classData, classBlockName, serviceData));
    header.appendChild(span);
    span.textContent = classBlockName;
    section.appendChild(header);
    section.appendChild(body);
    for (let classBlockPropName in classData[classBlockName]) {
        body.appendChild(getMemberBlock({
            classData, classBlockName, classBlockPropName, serviceData
        }));
    }
    
    return section;

}