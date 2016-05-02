import { block } from "../domUtils";

let loader = null;

/**
 * Returns loader animated element markup.
 * @returns {HTMLElement}
 */
function getLoaderElement () {
    let b = block(`div`, `loader`),
        b1 = block(`div`, `inner one`),
        b2 = block(`div`, `inner two`),
        b3 = block(`div`, `inner three`);
    b.appendChild(b1);
    b.appendChild(b2);
    b.appendChild(b3);
    return b;
}

export function showLoader () {
    
    if (loader)
        return;
    
    document.body.appendChild(loader = getLoaderElement());
    
}

export function hideLoader () {
    
    if (loader && loader.parentNode)
        loader.parentNode.removeChild(loader);
    
    loader = null;
    
}