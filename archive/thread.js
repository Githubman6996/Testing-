let frames = [];

function shuffle(array, bogo) {
    for (let i = 0; i < array.length - 1; i++)
        swap(array, i, Math.floor(Math.random() * (array.length - i)) + i, true || bogo);
}

function reverse(arr) {
    let n = arr.length / 2;
    for (let i = 0; i < n; ++i) swap(arr, i, arr.length - 1 - i, true);
}

function bogo(arr) {
    let sorted = false;
    while (!sorted) {
        shuffle(arr, true);
        printArr(arr, 0, arr.length, false);
        sorted = true;
        for (let i = 0; i < arr.length - 1; i++) if (arr[i] > arr[i + 1]) {
            sorted = false;
            break;
        }
    }
}

// Math.random()*(i - n) + i

function shuffle2(arr) {
    let cur = arr.length;
    while (cur > 0) {
        let ind = Math.floor(Math.random() * cur);
        cur--;
        swap(arr, cur, ind);
    }
    // swaps = 0;
}
function swap(arr, i, j, dontPrint) {
    [arr[i], arr[j]] = [arr[j], arr[i]];
    if (!dontPrint) {
        printArr(arr, Math.min(i, j), Math.max(i, j), true);
    }
}
function bubble(arr) {
    for (let i = 0; i < arr.length; i++)
        for (let j = 0; j < arr.length - i - 1; j++)
            if (arr[j] > arr[j + 1]) swap(arr, j, j + 1);
}

function optimizedBubble(arr) {
    let swapped = false;
    for (let i = 0; i < arr.length; i++) {
        swapped = false;
        for (let j = 0; j < arr.length - i - 1; j++) if (arr[j] > arr[j + 1]) {
            swap(arr, j, j + 1);
            swapped = true;
        }
        if (!swapped) break;
    }
}

function heap(arr) {
    let start = Math.floor(arr.length / 2), end = arr.length;
    while (end > 1) {
        if (start > 0) start--;
        else {
            end--;
            swap(arr, end, 0);
        }
        let root = start;
        while (root * 2 + 1 < end) {
            let child = root * 2 + 1;
            if (child + 1 < end && arr[child] < arr[child + 1]) child++;
            if (arr[root] >= arr[child]) break;
            swap(arr, root, child);
            root = child;
        }
    }
}


function quick(arr, min, max) {
    if (min >= max || min < 0) return;
    const pivot = partition(arr, min, max);
    quick(arr, min, pivot - 1);
    quick(arr, pivot + 1, max);
}

function partition(arr, min, max) {
    const pivot = arr[max];
    let ind = min - 1;
    for (let i = min; i <= max; i++) 
        if (arr[i] < pivot && ++ind != i) 
            swap(arr, ind, i);
    swap(arr, ++ind, max);
    return ind;
}

function merge(arr, min, max, array, changes, depth = 0) {
    if (max - min <= 1) return;
    // console.log(arr);
    changes ??= arr.slice();
    // arr[min] > arr[max] && swap(arr, min, max);
    const half = Math.floor((min + max) / 2);
    merge(array, min, half, arr, changes, depth + 1);
    merge(array, half, max, arr, changes, depth + 1);
    let i = min, j = half;
    for (let k = min; k < max; k++) {
        let first = arr[i], second = arr[j], cache = array[k];
        if (i < half && (j >= max || first <= second)) {
            array[k] = changes[k] = first;
            i++;
        } else {
            array[k] = changes[k] = second;
            j++;
        }
        // if (array[k] != cache) 
        // printArr(changes, k, k, true);
        printArr(changes, k, k, true);
        // await new Promise(r => setTimeout(r, 0));
    }
    if (depth == 0) for (let i = 0; i < arr.length; i++) arr[i] = array[i];
}

function heapify(arr) {
    let start = Math.floor(arr.length / 2 - 1) + 1;
    while(start > 0) {
        start--;
        let root = start;
        while (2 * root + 1 < arr.length) {
            let child = 2 * root + 1;
            if (child + 1 < arr.length && arr[child] < arr[child + 1]) child++;
            if (arr[root] < arr[child]) {
                swap(arr, root, child);
                root = child;
            } else break;
        }
    }
}

function selection(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        let min = i;
        for (let j = i + 1; j < arr.length; j++)
            if (arr[j] < arr[min]) min = j;
        if (min != i) swap(arr, min, i);
    }
}

function bubble(arr) {
    for (let i = 0; i < arr.length; i++)
        for (let j = 0; j < arr.length - i - 1; j++)
            if (arr[j] > arr[j + 1]) swap(arr, j, j + 1);
}

function insertion(arr) {
    for (let i = 1; i < arr.length; i++) 
        for (let j = i; j > 0 && arr[j - 1] > arr[j]; j--)
            swap(arr, j - 1, j)
}

function radix(arr, base) {
    const count = new Array(base), n = arr.length;
    for (let exp = 1; Math.floor(n / exp) > 0; exp *= base){
        const output = new Array(n);
        let i;
        count.fill(0);
     
        // Store count of occurrences
        // in count[]
        for (i = 0; i < n; i++)
            count[Math.floor(arr[i] / exp) % base]++;
     
        // Change count[i] so that count[i]
        // now contains actual position
        // of this digit in output[]
        for (i = 1; i < base; i++)
            count[i] += count[i - 1];
     
        // Build the output array
        for (i = n - 1; i >= 0; i--) {
            output[count[Math.floor(arr[i] / exp) % base] - 1] = arr[i];
            count[Math.floor(arr[i] / exp) % base]--;
        }
     
        // Copy the output array to arr[],
        // so that arr[] now contains sorted
        // numbers according to current digit
        for (i = 0; i < n; i++){
            arr[i] = output[i];
            printArr(arr, i, i, true);
        }
    }
}

function copy(arr) {
    const array = new Uint16Array(arr.length);
    for (let i = 0; i < arr.length; i++) array[i] = arr[i];
    return array;
}

function sort(arr, func, ...args) {
    // await printArr(arr, 0, arr.length);
    const array = copy(arr);
    self.start = performance.now();
    self.current = array;
    func(array, ...args);
    console.log(`Took ${performance.now() - self.start}ms`);
    // printArr(array, 0, array.length);
    console.log(func.name, array);
    const message = new Float32Array(2);
    message[0] = 1;
    message[1] = arr.length;
    postMessage(message.buffer, [message.buffer]);
}

function printArr(arr, min, max, ex) {
    const message = new Float32Array((ex ? 2 : arr.length) + 5);
    message[0] = 0;
    message[1] = min;
    message[2] = max;
    message[3] = ex;
    message[4] = performance.now();
    if (ex) {
        message[5] = arr[min];
        message[6] = arr[max];
    } else for (let i = 0; i < arr.length; i++) message[i + 5] = arr[i];
    postMessage(message.buffer, [message.buffer]);
}

onmessage = async function (e) {
    // if (e.data.action == "done") {
    //     await Promise.resolve();
    //     frames.length && printArr(...frames.shift());
    // }
    if (e.data.action != "sort") return;
    const arr = new Uint16Array(e.data.length);
    for (let i = 0; i < e.data.length; i++) arr[i] = i;
    printArr(arr, 0, arr.length);
    shuffle(arr);
    let a = new Float32Array(1); a[0] = 2;
    postMessage(a.buffer, [a.buffer]);
    printArr(arr, 0, arr.length);
    
    // sort(arr, bogo);
    switch(e.data.sort) {
        case "insertion": sort(arr, insertion); break;
        case "selection": sort(arr, selection); break;
        case "bubble": sort(arr, bubble); break;
        case "optimizedBubble": sort(arr, optimizedBubble); break;
        case "quick": sort(arr, quick, 0, arr.length - 1); break;
        case "radix2": sort(arr, radix, 2); break;
        case "radix4": sort(arr, radix, 4); break;
        case "radix10": sort(arr, radix, 10); break;
        case "heap": sort(arr, heap); break;
        case "merge": sort(arr, merge, 0, arr.length, arr.slice()); break;
    }
    // sort(arr, selection);
    // sort(arr, bubble);
    // sort(arr, insertion);
    // sort(arr, heap);
    // sort(arr, quick, 0, arr.length - 1);
    // console.log(arr)
    // sort(arr, merge, 0, arr.length, arr.slice());
    // printArr(arr, 0, arr.length);
    console.log(arr)
}

console.log("11rhi")