/**
 * Creates an element.
 * @param {string} element - Tag Name
 * @param {string} [className] - CSS class name
 * @param {string} [textContent] - Optional content
 * @returns {Element}
 */
export function block (element = "div", className, textContent) {
    let el = document.createElement(element || "div");
    if (className) el.className = className;
    if (textContent) el.textContent = textContent;
    return el;
}

/**
 * @param {string} type
 * @param {string} minWidth - CSS minWidth
 * @param {string} maxWidth - CSS maxWidth
 * @param {string} placeholder - placeholder of input.
 * @param {string} value
 * @param {string} className
 * @returns {Element}
 */
export function autoSizeInput ({
    type = "text", minWidth = "30px", maxWidth = "100%", placeholder, value, className
}) {

    let input = block(`input`, `auto${ className ? " " + className : "" }`);

    function updateInput () {
        let style = window.getComputedStyle(input),
            ghost = document.createElement(`span`);
        ghost.style.cssText = `box-sizing:content-box;display:inline-block;height:0;`
            + `overflow:hidden;position:absolute;top:0;visibility:hidden;white-space:nowrap;`
            + `font-family:${ style.fontFamily };font-size:${ style.fontSize };`
            + `padding:${ style.padding }`;
        ghost.textContent = input.value;
        document.body.appendChild(ghost);
        input.style.width = ghost.offsetWidth + 4 + "px";
        document.body.removeChild(ghost);
    }

    input.setAttribute(`type`, type);
    input.style.minWidth = minWidth;
    input.style.maxWidth = maxWidth;
    input.setAttribute(`placeholder`, placeholder);
    input.style.width = minWidth;
    if (value) {
        input.value = value;
        setTimeout(() => updateInput(), 1);
    }
    input.addEventListener(`input`, () => updateInput());

    return input;

}

/**
 * Safely detach element from the DOM.
 * @param {HTMLElement} element
 */
export function detach (element) {
    if (element.parentNode)
        element.parentNode.removeChild(element);
}

export function insertAfter (elem, refElem) {
    return refElem.parentNode.insertBefore(elem, refElem.nextSibling);
}

export function prepend (element, container) {
    if (container.firstChild) {
        container.insertBefore(element, container.firstChild);
    } else {
        container.appendChild(element);
    }
}

export function clearSelection () {
    if (window.getSelection)
        window.getSelection().removeAllRanges();
    else if (document.selection)
        document.selection.empty();
}

/**
 * @param {boolean=false} [checked]
 * @returns {Element}
 */
export function toggle (checked = false) {
    let id = `checkbox-${ Math.random().toString().slice(2) }`,
        box = block(`span`, `toggle`),
        label = block(`label`),
        checkbox = block(`input`);
    checkbox.setAttribute(`type`, `checkbox`);
    checkbox.setAttribute(`id`, id);
    label.setAttribute(`for`, id);
    if (checked)
        checkbox.setAttribute(`checked`, "true");
    box.appendChild(checkbox);
    box.appendChild(label);
    box.checkbox = checkbox;
    return box;
}

/**
 * This function removes child taking animation into account.
 * @param {HTMLElement} element
 * @param {string} property
 * @param {*} finalValue
 */
export function waitRemoveChild (element, property, finalValue) {
    let int = setInterval(() => {
        if (element[property] === finalValue) {
            clearInterval(int);
            if (element.parentNode)
                element.parentNode.removeChild(element);
        }
    }, 25);
}

/**
 * This function enables select element "onchange" event trigger not depending on what option is
 * chosen now.
 * @param {HTMLSelectElement|HTMLElement} selectElement
 */
export function freeSelect (selectElement) {
    selectElement.addEventListener("focus", () => selectElement.selectedIndex = -1);
    selectElement.addEventListener("change", () => selectElement.blur());
}

/**
 * This function creates inline input, which goes right after the element given.
 * @param {HTMLElement} anchorElement - Element which can be clicked to submit the input.
 * @param {string} placeholder
 * @param {boolean} required - If it is required for input not to be empty.
 * @param {number} inputWidth
 * @param {function} handler - Function that handles input or abort.
 */
export function awaitInlineInput (anchorElement, {
    placeholder, required = true, inputWidth = 150
}, handler) {

    let input = block(`input`, `inline inline-input`);
    input.setAttribute(`type`, `text`);
    input.setAttribute(`placeholder`, placeholder || "Enter something...");
    input.style.width = 0;
    input.style.height = anchorElement.offsetHeight + "px";
    input.style.fontFamily = "inherit";
    input.style.fontSize = anchorElement.offsetHeight/2;

    function submit (e) {

        e.cancelBubble = true;
        e.stopPropagation();
        e.preventDefault();

        end(input.value);

    }

    function end (val) {

        if (required && val === "")
            return;
        
        anchorElement.style.width = "";
        input.style.width = 0;
        waitRemoveChild(input, "offsetWidth", 0);
        anchorElement.removeEventListener(`mousedown`, submit);
        anchorElement.removeEventListener(`touchstart`, submit);
        input.removeEventListener(`submit`, submit);
        input.removeEventListener(`input`, onInput);
        input.removeEventListener(`keydown`, keyDown);
        input.removeEventListener(`blur`, abort);

        if (val !== null)
            handler(false, val);
        else
            handler(true, "");

    }

    function onInput () {

        let value = input.value;

        if (value)
            anchorElement.style.width = "";
        else if (required)
            anchorElement.style.width = 0;

    }

    function keyDown (e) {

        if (e.keyCode === 13) // ENTER
            end(input.value);
        else if (e.keyCode === 27) // ESC
            end(null);

    }

    function abort () {

        end(null);

    }

    input.addEventListener(`keydown`, keyDown);
    input.addEventListener(`input`, onInput);
    input.addEventListener(`blur`, abort);
    anchorElement.addEventListener(`mousedown`, submit);
    anchorElement.addEventListener(`touchstart`, submit);
    input.addEventListener(`submit`, submit);

    insertAfter(input, anchorElement);
    anchorElement.style.width = 0;
    setTimeout(() => {
        input.style.width = `${ inputWidth }px`;
        input.focus();
    }, 1);
    
}

/**
 * Handler that provides a way to handle input or input cancel.
 * @callback inputCallback
 * @param {boolean} cancelled
 * @param {string} input
 */