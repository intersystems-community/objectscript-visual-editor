/**
 * Creates an element.
 * @param {string} element - Tag Name
 * @param {string} [className] - CSS class name
 * @param {string} [textContent] - Optional content
 * @returns {Element}
 */
export function block (element = "div", className,  textContent) {
    let el = document.createElement(element || "div");
    if (className) el.className = className;
    if (textContent) el.textContent = textContent;
    return el;
}