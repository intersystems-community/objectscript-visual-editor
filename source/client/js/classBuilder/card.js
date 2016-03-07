function block (className) {
    let el = document.createElement("div");
    el.className = className;
    return el;
}

/**
 * This function returns card element that may be applied to the grid.
 * @param {*} data
 * @returns {HTMLElement}
 */
export function getCardElement (data) {
    let card = block(`card ${ data["_type"] }`),
        head = block(`head`),
        headIcon = block(`icon ${ data["ClassType"] || "" }`),
        header = block(`header`);

    header.textContent = data["name"];

    head.appendChild(headIcon);
    head.appendChild(header);
    card.appendChild(head);
    return card;
}