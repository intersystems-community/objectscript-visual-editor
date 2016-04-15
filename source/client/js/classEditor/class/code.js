import { block } from "../../domUtils";
import { addChange } from "../changes";

export function getCodeCaptionView ({ manifest, name, data, savePath }) {
    
    let div = block(`div`, `property-block`),
        editBlock = block(`div`);

    editBlock.textContent = data[name] || "";

    let editor = ace.edit(editBlock);
    editor.setOptions({
        maxLines: Infinity
    });

    div.appendChild(editBlock);
    editor.resize();

    return div;
    
}