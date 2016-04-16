import { block, autoSizeInput } from "../../domUtils";

/**
 * @param {boolean} inline
 */
export function getTypePickerView ({ inline }) {

    let input = inline ? autoSizeInput({ placeholder: "Type" }) : block(`input`);

    if (!inline)
        input.setAttribute(`type`, `text`);

    return input;

}