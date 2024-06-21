let gl;
export class Renderer {
    canvas; gl; loaded; locations = Object.create(null);
    constructor() {
        if (gl) throw new Error("Can only have one Renderer instance.");
        this.canvas = document.querySelector("canvas");
        this.gl = gl = this.canvas.getContext("webgl", { preserveDrawingBuffer: true, antialias: false });
        if (!gl)
            alert('Unable to initialize WebGL. Your browser may not support it.');
        this.compileShader = this.compileShader.bind(this);
        this.resizeCanvas = this.resizeCanvas.bind(this);
        this.load = this.load.bind(this);
        this.loaded = this.load();
    }
    resizeCanvas(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }
    async load() {
        let vertexShader, fragmentShader;
        try {
            vertexShader = await this.compileShader("vertex.glsl", gl.VERTEX_SHADER);
            fragmentShader = await this.compileShader("fragment.glsl", gl.FRAGMENT_SHADER);
        } catch (e) {
            console.error(e);
        }
        if (!vertexShader || !fragmentShader) alert("Error compiling shaders");
        this.shaderProgram = gl.createProgram();
        gl.attachShader(this.shaderProgram, vertexShader);
        gl.attachShader(this.shaderProgram, fragmentShader);
        gl.linkProgram(this.shaderProgram);
        if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) console.error('Unable to initialize the shader program:', gl.getProgramInfoLog(this.shaderProgram));
        gl.useProgram(this.shaderProgram);
        
        this.vertexBuffer = gl.createBuffer();
        this.hueBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        
        const positionAttrib = gl.getAttribLocation(this.shaderProgram, 'aVertexPosition');
        gl.enableVertexAttribArray(positionAttrib);
        gl.vertexAttribPointer(positionAttrib, 2, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.hueBuffer);
        const hueAttrib = gl.getAttribLocation(this.shaderProgram, 'aHue');
        gl.enableVertexAttribArray(hueAttrib);
        gl.vertexAttribPointer(hueAttrib, 1, gl.FLOAT, false, 0, 0);
        
        var hue = this.locations.hue = gl.getUniformLocation(this.shaderProgram, "u_type");
        
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }
    async compileShader(src, type) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, await fetch(src).then(x => x.text()));
        gl.compileShader(shader);
    
        if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
        
        gl.deleteShader(shader);
        throw new Error('Shader compilation error:', gl.getShaderInfoLog(shader));
    }
}


export class Graphic {
    static MARGIN = 1;
    renderer;
    cache = Object.create(null); cInd = 0;
    buffers = {};
    offset = 0;
    length = 0;
    constructor(renderer) {
        this.renderer = renderer;
        this.onresize = this.onresize.bind(this);
        window.addEventListener("resize", this.onresize);
        this.lastRatio = window.devicePixelRatio;
        this.init = this.init.bind(this);
        this.addLine = this.addLine.bind(this);
        this.renderArray = this.renderArray.bind(this);
        this.loadRender = this.loadRender.bind(this);
    }
    init(length) {
        this.buffers.lineBuffer = new Float32Array(length * 4);
        this.buffers.clearBuffer = new Float32Array(length * 4);
        this.buffers.hues = new Float32Array(length * 2);
        const scale = innerWidth / length;
        this.renderer.canvas.style.scale = `${scale} 1`;
        this.renderer.canvas.style.left = `${(innerWidth - length) / 2}px`;
        this.renderer.resizeCanvas(length, innerHeight);
        this.offset = 1 / length;
        this.length = length;
    }
    onresize() {
        if (this.lastRatio != window.devicePixelRatio) return this.lastRatio = window.devicePixelRatio;
        const canvas = this.renderer.canvas;
        canvas.style.scale = (innerWidth / canvas.width) + " " + (innerHeight / canvas.height);
        canvas.style.left = `${(innerWidth - canvas.width) / 2}px`;
        canvas.style.top = `${(innerHeight - canvas.height) / 2}px`;
    }
    addLine(arr, i, gets, clears) {
        if (this.length != arr.length) this.init(arr.length);
        if (i < 0 || i >= arr.length) return;
        const temp = this.cInd;
        if (i in this.cache) this.cInd = this.cache[i];
        else this.cache[i] = this.cInd;
        this.buffers.clearBuffer[this.cInd] = this.buffers.lineBuffer[this.cInd] = i * 2 / arr.length - 1 + this.offset;
        this.buffers.clearBuffer[this.cInd + 1] = this.buffers.lineBuffer[this.cInd + 1] = -1;
        this.buffers.clearBuffer[this.cInd + 2] = this.buffers.lineBuffer[this.cInd + 2] = i * 2 / arr.length - 1 + this.offset;
        this.buffers.clearBuffer[this.cInd + 3] = 1;
        this.buffers.lineBuffer[this.cInd + 3] = (arr[i] + 1) * 2 / arr.length - 1;
        this.buffers.hues[this.cInd / 2] = this.buffers.hues[this.cInd / 2 + 1] = gets.has(i) ? 2 : (arr[i] / arr.length);
        if (clears.has(i)) clears.delete(i);
        this.cInd = this.cInd == temp ? this.cInd + 4 : temp;
    }
    renderArray(arr, min, max, exclusive, gets, clears) {
        if (this.length != arr.length) this.init(arr.length);
        min ??= 0;
        max ??= arr.length;
        for (const item of clears) this.addLine(arr, item, gets, clears);
        for (const item of gets) this.addLine(arr, item, gets, clears);
        if (exclusive) for (let j = -Graphic.MARGIN; j <= Graphic.MARGIN; j++) {
            this.addLine(arr, min + j, gets, clears);
            if (min != max) this.addLine(arr, max + j, gets, clears);
        } else for (let i = min; i <= max; i++) this.addLine(arr, i, gets, clears);
    }
    loadRender() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.renderer.hueBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.buffers.hues, gl.STATIC_DRAW);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.renderer.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.buffers.clearBuffer, gl.STATIC_DRAW);
        
        gl.uniform1i(this.renderer.locations.hue, 1);
        gl.drawArrays(gl.LINES, 0, this.cInd / 2);
        
        gl.bufferData(gl.ARRAY_BUFFER, this.buffers.lineBuffer, gl.STATIC_DRAW);
        
        gl.uniform1i(this.renderer.locations.hue, 0);
        gl.drawArrays(gl.LINES, 0, this.cInd / 2);
        this.cInd = 0;
        this.cache = Object.create(null);
    }
}