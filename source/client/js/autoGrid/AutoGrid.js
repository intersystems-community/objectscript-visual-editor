/**
 * AutoGrid - responsive, adaptive automatic layout that just works for you. Everything you have to
 * do is to create AutoGrid instance with argument of container element, and AutoGrid will do
 * the best layout for you.
 * NOTE. AutoGrid will turn container's position to relative and overflow to auto.
 * @author Nikita Savchenko aka ZitRo (zitros.lab@gmail.com)
 * @param {HTMLElement} container - Block that contains blocks to align.
 */
export default function AutoGrid (container) {

    if (!(container instanceof HTMLElement))
        throw new Error(`container (${container}) is not HTML element.`);

    container.style.position = "relative";
    container.style.overflow = "auto";

    container.addEventListener("resize", () => {
        console.log("Grid resized!");
    });

}