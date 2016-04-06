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
        let title = document.querySelector("#footer-terminal iframe").contentDocument
            .querySelector("title").textContent.toLowerCase();
        if (title.indexOf(`not found`) !== -1 || title.indexOf(`404`) !== -1) {
            element.removeChild(iFrame);
            let b1 = block(`div`, `central`), b2 = block(`div`), b3 = block(`div`);
            b1.appendChild(b2);
            b2.appendChild(b3);
            b3.innerHTML = `To use the embedded terminal, you need <b>Cach&eacute; Web Terminal</b>
                to be installed in your system.<br/><br/>Please, visit 
                <a href="http://intersystems-ru.github.io/webterminal/#downloads" target="_blank">
                WebTerminal homepage</a> to download and install it.`;
            element.appendChild(b1);
        }
    });
    
}