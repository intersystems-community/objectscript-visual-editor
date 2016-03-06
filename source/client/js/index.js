import { AutoGrid } from "./autoGrid/AutoGrid";
import { getList } from "./server";

window.addEventListener("load", () => {

    let grid = new AutoGrid(document.querySelector("#classBuilderBody"));

    for (let i = 0; i < 10; i++) {
        let div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `This is a text inside the card number ${i} with the random number of word `
            + (() => {
                let i, arr = [], n = Math.random()*100;
                for (i = 0; i < n; i++) {
                    arr.push("hello"); if (Math.random() < 0.1) arr.push("<br/>");
                }
                return arr.join(" ");
            })();
        grid.applyChild(div);
    }

    getList("SAMPLES", "", (data) => {
        console.log(data);
    });

});