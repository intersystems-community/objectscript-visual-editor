import { block, autoSizeInput, awaitInlineInput } from "../../domUtils";
import { addChange } from "../changes";

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
 * @returns {*[]}
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

function getParameterView (model, save, del, blur) {
    
    let span = block(`span`, `parameter`),
        eq = block(`span`, `secondary`, ` = `),
        nameInput = autoSizeInput({
            placeholder: `Name`,
            value: model.name || ""
        }),
        valueInput = autoSizeInput({
            placeholder: `Value`,
            value: model.value || ""
        });
    
    span.appendChild(nameInput);
    span.appendChild(eq);
    span.appendChild(valueInput);
    
    nameInput.addEventListener(`input`, () => {
        model.name = nameInput.value;
        save();
    });
    valueInput.addEventListener(`input`, () => {
        model.value = valueInput.value;
        save();
    });
    nameInput.addEventListener(`blur`, () => {
        if (nameInput.value !== "")
            return;
        if (span.parentNode)
            span.parentNode.removeChild(span);
        del(model);
    });
    nameInput.addEventListener(`blur`, blur);
    valueInput.addEventListener(`blur`, blur);
    
    return span;
    
}

function getParamsSpan (parameters = [], save, blur) {
    
    let paramsSpan = block(`span`, `parametersSpan`),
        paramPlus = block(`span`, `parameter`),
        plusEl = block(`span`, `interactive small add icon`);
    
    function del (model) {
        for (let i = 0; i < parameters.length; i++) {
            if (parameters[i] === model) {
                parameters.splice(i, 1);
                break;
            }
        }
        save();
    }

    for (let p of parameters) {
        paramsSpan.appendChild(getParameterView(p, save, del, blur));
    }

    paramPlus.appendChild(plusEl);
    paramsSpan.appendChild(paramPlus);
    plusEl.addEventListener(`click`, () => awaitInlineInput(plusEl, {
        placeholder: `New Parameter...`
    }, (cancelled, name) => {

        if (cancelled)
            return;

        let model = {
            name: name,
            value: ""
        };

        paramsSpan.insertBefore(getParameterView(model, save, del, blur), paramPlus);
        parameters.push(model);

    }));

    return paramsSpan;
    
}

/**
 * @param {*} model
 * @param {function} save - Function that saves the model.
 * @param {function} remove - Function that removes the model part and saves the new model as well.
 * @returns {Element}
 */
function getArgumentView (model, save, remove) {

    let argumentSpan = block(`span`, `argument`),
        nameInput = autoSizeInput({ placeholder: `Name`, value: model.name, className: `nameInput` }),
        asSpan = block(`span`, `typeSpan`),
        defaultSpan = block(`span`),
        paramsSpan = getParamsSpan(model.parameters, save, blur);

    function paramsSpanIsActive () {
        return document.activeElement
            && (document.activeElement.parentNode === paramsSpan
                || document.activeElement.parentNode.parentNode === paramsSpan);
    }

    function blur () {
        setTimeout(() => {
            if (
                document.activeElement !== defaultInput
                && document.activeElement !== typeInput
                && document.activeElement !== nameInput
                && typeInput.value === ""
            ) {
                hide(asSpan);
            }
            if (
                document.activeElement !== defaultInput
                && document.activeElement !== typeInput
                && document.activeElement !== nameInput
                && defaultInput.value === ""
            ) {
                hide(defaultSpan);
            }
            if (
                document.activeElement !== defaultInput
                && document.activeElement !== typeInput
                && document.activeElement !== nameInput
                && !paramsSpanIsActive()
                && (model.parameters || []).length === 0
            ) {
                hide(paramsSpan);
            }
            if (nameInput.value === "") {
                if (argumentSpan.parentNode)
                    argumentSpan.parentNode.removeChild(argumentSpan);
                remove(model);
            }
        }, 200);
    }

    argumentSpan.appendChild(nameInput);

    asSpan.appendChild(block(`span`, `asSpan`, ` As `));
    let typeInput = autoSizeInput({ placeholder: `Type`, value: model.type || "" });
    if (!model.type) {
        hide(asSpan);
    }
    asSpan.appendChild(typeInput);
    argumentSpan.appendChild(asSpan);

    if (!model.parameters || !model.parameters.length) {
        hide(paramsSpan);
    }
    argumentSpan.appendChild(paramsSpan);

    defaultSpan.appendChild(block(`span`, `defSpan`, ` = `));
    let defaultInput = autoSizeInput({ placeholder: `Default`, value: model.default || "" });
    if (!model.default) {
        hide(defaultSpan);
    }
    defaultSpan.appendChild(defaultInput);
    argumentSpan.appendChild(defaultSpan);

    nameInput.addEventListener(`focus`, () => {
        if (typeInput.value === "")
            show(asSpan);
        if (defaultInput.value === "")
            show(defaultSpan);
    });
    nameInput.addEventListener(`blur`, () => blur());
    typeInput.addEventListener(`blur`, () => blur());
    defaultInput.addEventListener(`blur`, () => blur());
    nameInput.addEventListener(`input`, () => {
        if (!nameInput.value)
            return;
        model.name = nameInput.value;
        save();
    });
    typeInput.addEventListener(`input`, () => {
        model.type = typeInput.value;
        save();
    });
    defaultInput.addEventListener(`input`, () => {
        model.default = defaultInput.value;
        save();
    });
    typeInput.addEventListener(`focus`, () => {
        if (typeInput.value === "")
            return;
        show(paramsSpan);
    });

    return argumentSpan;

}

export function getFormalSpecEditor ({ formalSpec = "", savePath }) {

    let container = block(`span`, `formalSpecEdit`),
        args = splitArguments(formalSpec),
        plusArg = block(`span`, `argument`),
        plusEl = block(`div`, `interactive small add icon`);

    function save () {
        let formalSpec = [];
        for (let fs of args) {
            formalSpec.push(`${ fs.name }${ fs.type ? ":" + fs.type : "" }${
                fs.type && fs.parameters && fs.parameters.length
                    ? "(" + fs.parameters.map(p => p.name + "=" + p.value).join(",") + ")"
                    : ""
            }${ fs.default ? "=" + fs.default : "" }`);
        }
        addChange(savePath, formalSpec.join(`,`));
    }

    function del (model) {
        for (let i = 0; i < args.length; i++) {
            if (args[i] === model) {
                args.splice(i, 1);
                break;
            }
        }
        save();
    }

    args.forEach((arg) => container.appendChild(getArgumentView(arg, save, del)));
    plusArg.appendChild(plusEl);
    container.appendChild(plusArg);
    plusEl.addEventListener(`click`, () => awaitInlineInput(plusEl, {
        placeholder: `New Argument...`
    }, (cancelled, name) => {

        if (cancelled)
            return;

        let model = {
            name: name
        };

        container.insertBefore(getArgumentView(model, save, del), plusArg);
        args.push(model);

    }));

    return container;

}