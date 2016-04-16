import { block, toggle } from "../../domUtils";
import { addChange } from "../changes";
import { Toast } from "../../toast";
import { updateGrid } from "../index";
import { getKeywordView } from "./keyword";
import { getFormalSpecEditor } from "./formalSpecEditor";

/**
 * Returns if the method code has routines.
 * @param code
 * @returns {boolean}
 */
function hasRoutineCode (code) {
    return !!code.match(/\n[^\s]/) || !!code.match(/^[^\s]/);
}

function switchToNoRoutineCode (code) {
    return code.replace(/^(?:\t| {1,4})/, "").replace(/\n(?:\t| {1,4})/g, "\n");
}

function switchToRoutineCode (code) {
    return code.replace(/^/, "\t").replace(/\n/g, "\n\t");
}

export function getCodeCaptionView ({ manifest, name, data, savePath }) {
    
    let div = block(`div`, `property-block`),
        header = block(`div`),
        editBlock = block(`div`, `editor`),
        code = (data[name] || "").replace(/\r?\n$/, ``),
        returnTypeProp = (manifest[name] || {})["returnTypeProperty"] || ``,
        ROUTINE_SUPPORT = hasRoutineCode(code),
        useRoutinesToggle = toggle(ROUTINE_SUPPORT),
        useRoutinesBlock = block(`div`, `property-block`),
        nb = block(`div`, `name-block`),
        vb = block(`div`, `value-block`),
        editor;
    
    function saveChanges () {
        let value = editor.getValue();
        addChange(savePath.concat(name), ROUTINE_SUPPORT ? value : switchToRoutineCode(value));
    }

    nb.textContent = `Use Routines`;
    vb.appendChild(useRoutinesToggle);
    useRoutinesBlock.appendChild(nb);
    useRoutinesBlock.appendChild(vb);
    header.appendChild(getFormalSpecEditor({
        formalSpec: data[`FormalSpec`],
        savePath: savePath.concat(`FormalSpec`)
    }));
    if (returnTypeProp)
        header.appendChild(getKeywordView({
            propManifest: manifest[returnTypeProp],
            propName: returnTypeProp,
            propData: data["ReturnType"],
            savePath: savePath.concat(returnTypeProp)
        }));
    header.appendChild(useRoutinesBlock);

    useRoutinesToggle.checkbox.addEventListener("change", () => {
        let value = editor.getValue(),
            curPos = editor.getCursorPosition();
        if (useRoutinesToggle.checkbox.checked) {
            editor.setValue(switchToRoutineCode(value), curPos);
            ROUTINE_SUPPORT = true;
        } else if (hasRoutineCode(value)) {
            useRoutinesToggle.checkbox.checked = true;
            new Toast(Toast.TYPE_ERROR, `Code must not have routine definitions`);
            return;
        } else {
            editor.setValue(switchToNoRoutineCode(value), curPos);
            ROUTINE_SUPPORT = false;
        }
        saveChanges();
    });

    if (!ROUTINE_SUPPORT)
        code = switchToNoRoutineCode(code);

    editBlock.textContent = code;

    editor = ace.edit(editBlock);
    editor.$blockScrolling = Infinity;
    editor.setOptions({
        maxLines: Infinity
    });

    editor.on(`change`, ({ start, end }) => {
        if (start.row !== end.row)
            setTimeout(() => updateGrid(), 25);
        saveChanges();
    });

    let hr = block(`hr`);
    hr.setAttribute(`title`, `Code Editor`);
    div.appendChild(hr);
    div.appendChild(header);
    // setTimeout(() => new AutoGrid(header), 1);
    div.appendChild(editBlock);
    editor.resize();

    return div;
    
}