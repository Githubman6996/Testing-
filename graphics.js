import { Renderer, Graphic } from "./classes/Renderer.js";

const renderer = new Renderer();
console.log(window.renderer = renderer);

const canvas = document.querySelector('canvas');
canvas.width = innerWidth;
canvas.height = innerHeight;
await renderer.loaded;
const graphic = new Graphic(renderer);
console.log(window.graphic = graphic);

export const addLine = graphic.addLine;

export const renderArray = graphic.renderArray;

export const loadRender = graphic.loadRender;