import { block } from "../../domUtils";
import { addChange } from "../changes";

export function getCodeCaptionView ({ manifest, name, data, savePath }) {
    
    let div = block(`div`, `property-block`),
        editBlock = block(`div`);

    editBlock.textContent = (data[name] || "").replace(/\r?\n$/, "");

    let editor = ace.edit(editBlock);
    editor.setOptions({
        maxLines: Infinity
    });

    editor.on(`change`, () => {
        addChange(savePath.concat(name), editor.getValue());
    });

    div.appendChild(editBlock);
    editor.resize();

    return div;
    
}