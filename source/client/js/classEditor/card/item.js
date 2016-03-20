import { block, insertAfter, clearSelection, prepend } from "../../domUtils";
import { updateGrid } from "../index";
import { addChange } from "../changes";

let MANIFEST = {
    Class: {

    },
    Parameters: {
        Abstract: {
            default: 0,
            type: "boolean"
        },
        Default: {
            default: "",
            type: "string",
            incompatible: {
                property: "Expression"
            }
        },
        Deprecated: {
            default: 0,
            type: "boolean"
        },
        Expression: {
            default: "",
            type: "string",
            incompatible: {
                property: "Default"
            }
        },
        Encoded: {
            default: 0,
            type: "boolean"
        },
        Final: {
            default: 0,
            type: "boolean"
        },
        Internal: {
            default: 0,
            type: "boolean"
        },
        Name: {
            required: true,
            type: "string",
            ignore: true
        },
        SequenceNumber: {
            ignore: true
        },
        Type: {
            default: "",
            type: "string"
        }
    },
    Properties: {
        Description: {
            ignore: true,
            default: ""
        },
        Calculated: {
            default: 0,
            type: "boolean"
        },
        Deprecated: {
            default: 0,
            type: "boolean"
        },
        Final: {
            default: 0,
            type: "boolean"
        },
        Identity: {
            default: 0,
            type: "boolean",
            classTypes: ["persistent"]
        },
        InitialExpression: {
            type: "string",
            default: "\"\""
        },
        Internal: {
            default: 0,
            type: "boolean"
        },
        MultiDimensional: {
            default: 0,
            type: "boolean"
        },
        Name: {
            type: "string",
            required: true,
            ignore: true // name cannot be change as it is an IdKey index field.
            // to change the name user must create a new property with the same parameters.
        },
        NoModBit: {
            default: 0,
            type: "boolean"
        },
        NotInheritable: {
            default: 0,
            type: "boolean"
        },
        Private: {
            default: 0,
            type: "boolean"
        },
        ReadOnly: {
            default: 0,
            type: "boolean"
        },
        Relationship: {
            default: 0
        },
        Required: {
            default: 0,
            type: "boolean"
        },
        SequenceNumber: {
            ignore: true
        },
        SqlComputed: {
            default: 0,
            type: "boolean"
        },
        Transient: {
            default: 0,
            type: "boolean"
        },
        Type: {
            type: "string",
            default: ""
        }
    },
    Methods: {
        Abstract: {
            default: 0,
            type: "boolean"
        },
        ClassMethod: {
            type: "boolean"
        },
        ClientMethod: {
            default: 0,
            type: "boolean"
        },
        CodeMode: {
            default: "code",
            type: "select",
            options: ["Call", "Code", "Expression", "ObjectGenerator"] // test if lowercase
        },
        Description: {
            ignore: true,
            default: ""
        },
        Deprecated: {
            default: 0,
            type: "boolean"
        },
        Final: {
            default: 0,
            type: "boolean"
        },
        ForceGenerate: {
            default: 0,
            type: "boolean",
            requires: {
                property: "CodeMode",
                value: "ObjectGenerator"
            }
        },
        Internal: {
            default: 0,
            type: "boolean"
        },
        Name: {
            type: "string",
            required: true,
            ignore: true // name cannot be change as it is an IdKey index field.
            // to change the name user must create a new property with the same parameters.
        },
        NoContext: {
            default: 0,
            type: "boolean"
        },
        NotForProperty: {
            default: 0,
            type: "boolean"
        },
        NotInheritable: {
            default: 0,
            type: "boolean"
        },
        Private: {
            default: 0,
            type: "boolean"
        },
        ReturnResultsets: {
            default: 0,
            type: "boolean"
        },
        ReturnType: {
            default: "",
            type: "string"
        },
        SequenceNumber: {
            ignore: true
        },
        SoapAction: {
            default: "[default]",
            type: "string"
        },
        SqlProc: {
            default: 0,
            type: "boolean"
        },
        WebMethod: {
            default: 0,
            type: "boolean"
        },
        ZenMethod: {
            default: 0,
            type: "boolean"
        }
    }
};

function getPropertyEditor (propName, value, propManifest, savePath) {
    let type = propManifest["type"] || "string",
        input;
    if (type === "boolean") {
        input = block(`input`, `toggle`);
        input.type = "checkbox";
        input.checked = !!value;
        input.addEventListener(`change`, () => addChange(
            savePath.concat(propName),
            input.checked ? 1 : 0
        ));
    } else { // string type
        input = block(`input`);
        input.type = "text";
        input.value = value;
        input.addEventListener(`input`, () => addChange(
            savePath.concat(propName),
            input.value
        ));
    }
    return input;
}

function getPropertyView ({ propManifest, propName, propData, savePath }) {
    let propBlock = block(`div`, `property-block`),
        propNameBlock = block(`div`, `name-block`),
        propEdit = block(`div`, `value-block`);
    propNameBlock.textContent = propName;
    if (propManifest.required) propNameBlock.classList.add(`required`);
    propEdit.appendChild(getPropertyEditor(propName, propData, propManifest, savePath));
    propBlock.appendChild(propNameBlock);
    propBlock.appendChild(propEdit);
    propBlock.PROPERTY_NAME = propName;
    return propBlock;
}

/**
 * Creates and returns interactive class block property editor.
 * @param classData
 * @param [classBlockName]
 * @param [classBlockPropName]
 * @returns {Element}
 */
function createView (classData, classBlockName, classBlockPropName) {
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
        container.appendChild(getPropertyView({
            propManifest, propName, propData: data[propName], savePath
        }));
    }
    return container;
}

/**
 * Enables block item interactivity.
 * @param {HTMLElement} headerElement
 * @param {*} classData
 * @param [classBlockName]
 * @param [classBlockPropName]
 */
export function enableItem ({headerElement, classData, classBlockName, classBlockPropName}) {
    
    let isClass = !classBlockName,
        opened = false,
        container, controls;

    headerElement.addEventListener(`click`, () => {
        if (!container) {
            container = isClass
                ? createView(classData)
                : createView(classData, classBlockName, classBlockPropName);
            controls = block(`div`, `controls`);
            let add = block(`select`, `interactive normal icon add`),
                del = block(`div`, `interactive normal icon delete`);
            controls.appendChild(add);
            controls.appendChild(del);
            add.addEventListener(`mousedown`, () => { // form the list of not present properties
                while (add.firstChild)
                    add.removeChild(add.firstChild);
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
                container.appendChild(getPropertyView({
                    propManifest: propManifest,
                    propName: propName,
                    propData: propManifest.default || "",
                    savePath: isClass
                        ? [classData["Name"]]
                        : [classData["Name"], classBlockName, classBlockPropName]
                }))
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