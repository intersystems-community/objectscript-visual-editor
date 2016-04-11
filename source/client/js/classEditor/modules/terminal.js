import { block } from "../../domUtils";

let INITIALIZED = false;

export function init (element, namespace) {
    
    if (INITIALIZED) return;
    INITIALIZED = true;

    let iFrame = block(`iframe`);
    iFrame.setAttribute(`src`, `/terminal/${ namespace ? "?NS=" + namespace : "" }`);
    iFrame.setAttribute(`frameborder`, "0");

    element.appendChild(iFrame);

    iFrame.addEventListener("load", () => {

        let title = "", b1, b2, b3;

        try {
            title = ((document.querySelector("#footer-terminal iframe").contentDocument
                    .querySelector("title") || {}).textContent || "403").toLowerCase();
        } catch (e) { title = "403"; }

        let is404 = title.indexOf(`not found`) !== -1 || title.indexOf(`404`) !== -1,
            is403 = title.indexOf(`forbidden`) !== -1 || title.indexOf(`403`) !== -1;
        
        if (is404 || is403) {
            element.removeChild(iFrame);
            b1 = block(`div`, `central`);
            b2 = block(`div`);
            b3 = block(`div`);
            b1.appendChild(b2);
            b2.appendChild(b3);
        }

        if (is404) {
            b3.innerHTML = `To use the embedded terminal, you need <b>Cach&eacute; Web Terminal</b>
                to be installed in your system.<br/><br/>Please, visit 
                <a href="http://intersystems-ru.github.io/webterminal/#downloads" target="_blank">
                WebTerminal homepage</a> to download and install it.`;
        } else if (is403) {
            b3.innerHTML = `Cannot access WebTerminal. Please, check if the user accessing terminal
                has correct roles assigned.`;
        }

        if (b1)
            element.appendChild(b1);

    });
    
}