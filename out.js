import { renderArray } from "./graphics.js";

let log = document.querySelector("div");
export const logElement = log;
export function print(text) {
    if (typeof text == "object") text = JSON.stringify(text);
    const element = document.createElement("span");
    element.textContent += text;
    log.append(element);
}

export function println(text) {
    if (typeof text == "object") text = JSON.stringify(text);
    const element = document.createElement("span");
    element.textContent += text;
    element.style.display = "block";
    log.append(element);
}
export function printArr(buf, min, max, ex, gets, clears) {
    const arr = new Float32Array(buf);
    renderArray(arr, Math.max(min - 1, 0), Math.min(arr.length, max + 1), ex, gets, clears);
}
export function printArr2(arr, min, max, ex, gets, clears) {
    renderArray(arr, Math.max(min - 1, 0), Math.min(arr.length, max + 1), ex, gets, clears);
}