import { getTypePickerView } from "./typePicker";
import { block, autoSizeInput } from "../../domUtils";

/**
 * Replaces the strings with spaces
 * @param string
 * @returns {string}
 */
function padSpace (string) {
    return string.replace(
        /"([^"]*)"/g,
        (a, part) => `"${ part.replace(/[\s\S]/g, " ")}"`
    );
}

/**
 * A hero function that handles formalSpec string like 'test2:%String(VALUELIST="1,2,3",MAXLEN=1)={"test"+"best"+{"a":1}},noType,typeOnly:Cinema.TicketOrder={##class(TestPack.MyType).%New("AHA!, AHAHA, AA!",1)},defaultOnly="lol"'
 * @param {string} formalSpec =
 * @returns {string[]}
 */
function splitArguments (formalSpec = "") {

    let braceStack = [{ el: "" }],
        padStr = padSpace(formalSpec), // replace strings with spaces, so "test" turns to "    ".
        braceArr = padStr.split("");

    braceArr.forEach((el, pos, arr) => {
        if (["{", "}", "(", ")"].indexOf(el) === -1)
            return el;
        if (
            (el === "}" && braceStack[braceStack.length - 1].el === "{")
            || (el === ")" && braceStack[braceStack.length - 1].el === "(")
        ) {
            for (let i = braceStack.pop().pos + 1; i < pos; i++) {
                arr[i] = " ";
            }
        } else {
            braceStack.push({ el: el, pos: pos });
        }
        return el;
    });

    let braceStr = braceArr.join(""), // at this point we have replaced all non-control commas
        args = [];

    braceStr.replace(/[^,]+/g, (part, pos) => {
        args.push({
            str: formalSpec.substr(pos, part.length),
            pad: padStr.substr(pos, part.length)
        });
    });

    args.forEach(({ str, pad }, pos, arr) => {
        let parArr = [],
            def = "",
            hasTypeParams = false;
        pad.replace(/^[\w]+:[^\(=]+\(([^\)]*)\)/, (part, params, pos) => {
            hasTypeParams = true;
            let originParams = str.substr(pos + part.length - params.length - 1, params.length),
                padOrigin = padSpace(originParams);
            padOrigin.replace(/[^,]+/g, (part, pos) => {
                let par = originParams.substr(pos, part.length),
                    name = (par.match(/^([^=]+)=/) || {})[1] || "";
                parArr.push({
                    name: name,
                    value: par.substr(name.length + 1)
                });
            });
        });
        pad.replace(
            hasTypeParams ? /\)=([\s\S]+)$/ : /=([\s\S]+)$/,
            (part, d, pos) => def = str.substr(pos + 1 + (hasTypeParams ? 1 : 0), d.length)
        );
        arr[pos] = {
            name: str.match(/^[^\.:=]+/)[0],
            type: (str.match(/:([^\(=]+)/) || {})[1] || "",
            parameters: parArr,
            default: def
        };
    });

    return args;
}

function show (element) {
    element.style.display = "";
}

function hide (element) {
    element.style.display = "none";
}

export function getFormalSpecEditor ({ formalSpec = "", savePath }) {

    let container = block(`div`, `formalSpecEdit`),
        args = splitArguments(formalSpec);

    args.forEach((arg, i) => {
        
        let span = block(`span`, `argument`),
            name = autoSizeInput({ placeholder: `Name`, value: arg.name, className: `nameInput` }),
            asSpan = block(`span`, `typeSpan`),
            defaultSpan = block(`span`);
        
        if (i > 0)
            span.appendChild(block(`span`, ``, `, `));
        
        span.appendChild(name);
        asSpan.appendChild(block(`span`, ``, ` As `));
        let typeInput = autoSizeInput({ placeholder: `Type`, value: arg.type || "" });
        if (!arg.type) {
            hide(asSpan);
        }
        asSpan.appendChild(typeInput);
        span.appendChild(asSpan);
        span.appendChild(defaultSpan);
        
        container.appendChild(span);
    });

    return container;

}