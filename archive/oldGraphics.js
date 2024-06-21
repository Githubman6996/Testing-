const canvas = document.querySelector('canvas');
canvas.width = innerWidth;
canvas.height = innerHeight;
const gl = canvas.getContext('webgl2', { preserveDrawingBuffer: true, antialias: false });
if (!gl) {
    alert('Unable to initialize WebGL. Your browser may not support it.');
}
const vertexShaderSource = await fetch("vertex.glsl").then(x => x.text());

const fragmentShaderSource = await fetch("fragment.glsl").then(x => x.text());

function compileShader(source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);

if (!vertexShader || !fragmentShader) alert('Error compiling shaders.');

const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);

if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) console.error('Unable to initialize the shader program:', gl.getProgramInfoLog(shaderProgram));

gl.useProgram(shaderProgram);

const vertexBuffer = gl.createBuffer();
const hueBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

const positionAttrib = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
gl.enableVertexAttribArray(positionAttrib);
gl.vertexAttribPointer(positionAttrib, 2, gl.FLOAT, false, 0, 0);

gl.bindBuffer(gl.ARRAY_BUFFER, hueBuffer);
const hueAttrib = gl.getAttribLocation(shaderProgram, 'aHue');
gl.enableVertexAttribArray(hueAttrib);
gl.vertexAttribPointer(hueAttrib, 1, gl.FLOAT, false, 0, 0);

var hue = gl.getUniformLocation(shaderProgram, "u_type");
var resolution = gl.getUniformLocation(shaderProgram, "resolution");

gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

window.resizeCanvas = (width, height) => {
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

let offset;
let real = 0;
let lineBuffer, clearBuffer, hues, cInd = 0;
let changes;

const MARGIN = 1;

let cache = Object.create(null), tempInd;

// let log = document.querySelector("#log2");

let lastRatio = window.devicePixelRatio;
window.onresize = (e) => {
    if (lastRatio != window.devicePixelRatio) return lastRatio = window.devicePixelRatio;
    canvas.style.scale = (innerWidth / canvas.width) + " " + (innerHeight / canvas.height);
    canvas.style.left = `${(innerWidth - canvas.width) / 2}px`;
    canvas.style.top = `${(innerHeight - canvas.height) / 2}px`;
}


export function addLine(arr, i, gets, clears) {
    tempInd = cInd;
    if (i in cache) cInd = cache[i];
    else cache[i] = cInd;
    clearBuffer[cInd] = lineBuffer[cInd] = i * 2 / arr.length - 1 + offset;
    clearBuffer[cInd + 1] = lineBuffer[cInd + 1] = -1;
    clearBuffer[cInd + 2] = lineBuffer[cInd + 2] = i * 2 / arr.length - 1 + offset;
    clearBuffer[cInd + 3] = 1;
    lineBuffer[cInd + 3] = (arr[i] + 1) * 2 / arr.length - 1;
    hues[cInd / 2] = hues[cInd / 2 + 1] = gets.has(i) ? 2 : (arr[i] / arr.length);
    if (clears.has(i)) clears.delete(i);
    cInd = cInd == tempInd ? cInd + 4 : tempInd;
}

export function renderArray(arr, min, max, exclusive, gets, clears) {
    if (!lineBuffer || !clearBuffer) {
        lineBuffer = new Float32Array(arr.length * 4);
        clearBuffer = new Float32Array(arr.length * 4);
        hues = new Float32Array(arr.length * 2);
        const scale = canvas.width / arr.length;
        canvas.style.scale = `${scale} 1`;
        canvas.style.left = `${(canvas.width - arr.length) / 2}px`;
        canvas.width = arr.length;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }
    if (!offset) {
        offset = 1 / arr.length;
        console.log(canvas.width / arr.length, offset);
    }
    min ??= 0;
    max ??= arr.length;
    for (const item of clears) addLine(arr, item, gets, clears);
    for (const item of gets) addLine(arr, item, gets, clears);
    if (exclusive) for (let j = -MARGIN; j <= MARGIN; j++) {
        addLine(arr, min + j, gets, clears);
        if (min != max) addLine(arr, max + j, gets, clears);
    } else for (let i = min; i < max; i++) addLine(arr, i, gets, clears);
}

export function loadRender() {
    gl.bindBuffer(gl.ARRAY_BUFFER, hueBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, hues, gl.STATIC_DRAW);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, clearBuffer, gl.STATIC_DRAW);
    
    gl.uniform1i(hue, 1);
    gl.drawArrays(gl.LINES, 0, cInd / 2);
    
    gl.bufferData(gl.ARRAY_BUFFER, lineBuffer, gl.STATIC_DRAW);
    
    gl.uniform1i(hue, 0);
    gl.drawArrays(gl.LINES, 0, cInd / 2);
    cInd = 0;
    cache = Object.create(null);
}