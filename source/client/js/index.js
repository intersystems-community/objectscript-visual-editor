import { init } from "./classEditor";
import { init as serverInit } from "./server";

window.addEventListener("load", () => {

    serverInit(data => init(data));

});