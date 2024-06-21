window.addEventListener("error", e => {
	alert(e.message)
});

import { Sorter } from "./classes/Sorter.js";
import { sorts } from "./data.js";

const sorter = new Sorter();
console.log(window.sorter = sorter);

const speedinp = document.querySelector("#speed");
const sizeDiv = document.querySelector("#size");
const sortSelect = document.querySelector("#sort-select")
const maxEl = document.querySelector("#max");
sizeDiv.value = innerWidth;
sizeDiv.oninput = e => {
    e.target.value = e.target.value.replace(/[^\d]/g, "");
    let max = sorts[sortSelect.getAttribute("value")]?.max;
    max && e.target.value > max && (e.target.value = max);
    speedinp.value = Math.round(log(+sizeDiv.value, 2) / 2)
    sorter.updateSpeed(+speedinp.value);
}

speedinp.oninput = e => {
    e.target.value = e.target.value.replace(/[^\d]/g, "");
    sorter.updateSpeed(Math.floor(1.09648**e.target.value));
}

const startBut = document.querySelector("#start");
startBut.onclick = () => {
    const sort = sortSelect.getAttribute("value");
    const shuffle = document.querySelector("#shuffle-select").getAttribute("value");
    // alert(sort);
    if (!sort) return;
    const speed = Math.round(log(+sizeDiv.value, 2) / 2);
    sorter.updateSpeed(speed);
    speedinp.value = log(speed, 1.09648);
    document.querySelector("#content").classList.remove("hidden");
    document.querySelector("#main").classList.add("hidden");
    sorter.start(sort, shuffle, +sizeDiv.value, false);
}

function log(n, base) {
	return Math.log(n) / Math.log(base);
}

document.querySelectorAll(".select").forEach((e) =>
    e.addEventListener("pointerenter", x =>
        e.querySelector(".options").style.pointerEvents = "unset"
    )
)

window.addEventListener("click", e => {
    if (!e.target.matches("option[value]")) return;
    e.target.parentElement.parentElement.setAttribute("value", e.target.value);
    document.querySelector(".select-text." + e.target.parentElement.getAttribute("data-type")).innerText = e.target.textContent;
    e.target.parentElement.style.pointerEvents = "none";
    let max = sorts[sortSelect.getAttribute("value")]?.max;
    max && sizeDiv.value > max && (sizeDiv.value = max);
    maxEl.innerHTML = `(Max: ${max})`;
})