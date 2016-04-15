import { init } from "./classEditor";
import { init as serverInit } from "./server";
import { configureToasts } from "./toast";

configureToasts({
    topOrigin: -48
});

window.addEventListener("load", () => {

    serverInit(data => init(data));

});