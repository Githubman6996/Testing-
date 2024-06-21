let exports, num = 0;
let size, arrays = Object.create(null);
let gets = 0, comps = 0, sets = 0, swaps = 0, agets = 0, acomps = 0, asets = 0, aswaps = 0, wasted = 0;

function copy(arr) {
    let ptr = exports.wasmmalloc(4 * size);
    const array = new Uint32Array(exports.memory.buffer, ptr, size);
    const old = new Uint32Array(exports.memory.buffer, arr, size);
    for (let i = 0; i < size; i++) array[i] = old[i];
    arrays[ptr] = array;
    // console.log(old, 69)
    return ptr;
}

function sort(ptr, func, ...args) {
    const array = ptr//copy(ptr);
    self.start = performance.now();
    self.current = array;
    func(array, ...args);
    console.log(`Took ${performance.now() - self.start - wasted}ms (${performance.now() - self.start} - ${wasted})`);
    console.log(func.name, array);
    const message = new Float32Array(2);
    message[0] = 1;
    message[1] = self.start;
    postMessage(message.buffer, [message.buffer]);
    exports.wasmfree(array);
}

let exMsg, wMsg, message;
function printArr(arr, min, max, ex, c) {
    message = ex ? (exMsg ||= new Float32Array(7)) : (wMsg ||= new Float32Array(arr.length + 5));
    message[0] = 0;
    message[1] = min;
    message[2] = max;
    message[3] = ex;
    message[4] = performance.now() - wasted;
    if (ex) {
        message[5] = arr[min];
        message[6] = arr[max];
    } else for (let i = 0; i < arr.length; i++) message[i + 5] = arr[i];
    postMessage(message.buffer);
}

let statsMsg;
function updateStats() {
    // console.log(asets)
    statsMsg ||= new Float32Array(9);
    statsMsg[0] = 3;
    statsMsg[1] = gets;
    statsMsg[2] = sets;
    statsMsg[3] = comps;
    statsMsg[4] = swaps;
    statsMsg[5] = agets;
    statsMsg[6] = asets;
    statsMsg[7] = acomps;
    statsMsg[8] = aswaps;
    postMessage(statsMsg.buffer)
}

function updateGets(...i) {
    postMessage(new Float32Array([4, ...i]));
}
function minRunLength(n) { 
    let r = 0; 
    while (n >= 32) {
        r |= (n & 1); 
        n >>= 1; 
    } 
    return n + r; 
} 

const memory = new WebAssembly.Memory({ initial: 256, maximum: 4096 });
let res;
let ptr, ptr3;
onmessage = async function (e) {
    if (!res) {
        res = await WebAssembly.instantiateStreaming(fetch(await fetch("index.wasm").then(x => x.text())), {
            js: {
                mem: memory
            },
            env: {
                seed: true ? Date.now : () => 0,
                emscripten_resize_heap: memory.grow,
                logNum: function (a, min, max, ex, c) {
                    now = performance.now();
                    printArr(arrays[a], min, max, ex, c);
                    wasted += performance.now() - now;
                },
                highlights: updateGets,
                logGet(a, i) {
                    now = performance.now();
                    gets++;
                    updateStats();
                    updateGets(i);
                    wasted += performance.now() - now;
                    // console.log("logGet", ...arguments);
                },
                logCom(a, i, j) {
                    now = performance.now();
                    comps++;
                    gets += 2;
                    updateStats();
                    updateGets(i, j)
                    wasted += performance.now() - now;
                    // console.log("logCom", ...arguments);
                },
                logSet(a) {
                    now = performance.now();
                    sets++;
                    updateStats();
                    wasted += performance.now() - now;
                    // console.log("logSet", ...arguments);
                },
                logSwap(a, i, j) {
                    now = performance.now();
                    gets += 2;
                    sets += 2;
                    swaps++;
                    updateStats();
                    updateGets(i, j);
                    wasted += performance.now() - now;
                    // console.log("logSwap", ...arguments);
                },
                incStat(a, v) {
                    now = performance.now();
                    switch (a) {
                        case 0: gets += v; break;
                        case 1: sets += v; break;
                        case 2: comps += v; gets += 2; break;
                        case 3: swaps += v; gets += 2; sets += 2; break;
                        case 4: agets += v; break;
                        case 5: asets += v; break;
                        case 6: acomps += v; agets += 2; break;
                        case 7: aswaps += v; agets += 2; asets += 2; break;
                    }
                    updateStats();
                    wasted += performance.now() - now;
                    // console.log("incStat", ...arguments);
                }
            }
        });
        console.log(exports = res.instance.exports);
    }
    if (e.data.action != "sort") return;
    size = e.data.length;
    ptr = exports.wasmmalloc(4 * size);
    exMsg = wMsg = null;
    const arr = new Uint32Array(exports.memory.buffer, ptr, size);
    arrays[ptr] = arr;
    for (let i = 0; i < size; i++) arr[i] = i;
    printArr(arr, 0, arr.length);
    switch (e.data.shuffle) {
        case "reverse": exports.reverse(ptr, size); break;
        case "almostSorted": exports.almostSorted(ptr, size); break;
        case "manySimilar":
            exports.manySimilar(ptr, size);
            exports.shuffle2(ptr, size);
            break;
        case "scrambledTail": exports.scrambledTail(ptr, size); break;
        case "finalMerge": exports.finalMerge(ptr, size); break;
        case "sawtooth": exports.sawtooth(ptr, size); break;
        case "pipeOrgan": exports.pipeOrgan(ptr, size); break;
        case "finalRadix": exports.finalRadix(ptr, size); break;
        case "heapify": exports.heapify(ptr, size); break;
        case "sineCurve": exports.sineCurve(ptr, size); break;
        default:
            exports.shuffle2(ptr, size);
    }
    let a = new Float32Array(1); a[0] = 2;
    postMessage(a.buffer, [a.buffer]);
    printArr(arr, 0, arr.length);
    gets = 0, comps = 0, sets = 0, swaps = 0, agets = 0, acomps = 0, asets = 0, aswaps = 0, wasted = 0;
    switch(e.data.sort) {
        case "insertion": sort(ptr, exports.insertion, size); break;
        case "selection": sort(ptr, exports.selection, size); break;
        case "bubble": sort(ptr, exports.bubble, size); break;
        case "optimizedBubble": sort(ptr, exports.optimizedbubble, size); break;
        case "quick": sort(ptr, exports.quick, 0, arr.length - 1, size); break;
        case "quick3": sort(ptr, exports.quick3, 0, arr.length - 1, size); break;
        case "stableQuick": sort(ptr, exports.stableQuick, 0, size); break;
        case "radix2": sort(ptr, exports.radixsort, size, 2); break;
        case "radix4": sort(ptr, exports.radixsort, size, 4); break;
        case "radix10": sort(ptr, exports.radixsort, size, 10); break;
        case "heap": sort(ptr, exports.heap, size); break;
        case "shell": sort(ptr, exports.shell, size); break;
        case "comb": sort(ptr, exports.comb, size); break;
        case "cycle": sort(ptr, exports.cycle, size); break; 
        case "cocktail": sort(ptr, exports.coctail, size); break;
        case "bitonic": sort(ptr, exports.bitonic, 0, size, true); break;
        case "gnome": sort(ptr, exports.gnome, size); break;
        case "stooge": sort(ptr, exports.stooge, 0, size - 1); break;
        case "oddEven": sort(ptr, exports.oddEven, size); break;
        case "timSort": sort(ptr, exports.timSort, size, minRunLength(size)); break;
        case "bogo": sort(ptr, exports.bogo, size); break;
        case "merge": {
            const ptr2 = copy(ptr);
            ptr3 = copy(ptr);
            sort(ptr, exports.merge, 0, arr.length, ptr2, ptr3, true, size);
            
            exports.wasmfree(ptr2);
            exports.wasmfree(ptr3);
            break;
        }
    }
    console.log(arr);
    // printArr(arr, 0, arr.length);
}