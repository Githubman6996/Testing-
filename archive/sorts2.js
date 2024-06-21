import {print, println, printArr, logElement} from "./out.js";
function printArr(arr, min, max) {
    postMessage({
        action: "print",
        arr, min, max
    });
}
// let swaps = 0;
async function swap(arr, i, j, dontPrint) {
    [arr[i], arr[j]] = [arr[j], arr[i]];
    // swaps++;
    if (!dontPrint) {
        return await printArr(arr, Math.min(i, j), Math.max(i, j), true);
        // return new Promise(r => setTimeout(r, 0))
    }
    // println(` ${swaps} (${i} ${j})`);
}

export async function shuffle(arr) {
    let cur = arr.length;
    while (cur > 0) {
        let ind = Math.floor(Math.random() * cur);
        cur--;
        await swap(arr, cur, ind);
    }
    // swaps = 0;
}
let toPrint = [];
export async function bogo(arr) {
    let sorted = false;
    let k = 0;
    while (!sorted) {
        let cur = arr.length;
        while (cur > 0) {
            let ind = Math.floor(Math.random() * cur);
            cur--;
            await swap(arr, cur, ind);
        }
        sorted = true;
        for (let i = 0; i < arr.length - 1; i++) if (arr[i] > arr[i + 1]) {
            sorted = false;
            break;
        }
    }
}

export async function insertion(arr) {
    for (let i = 1; i < arr.length; i++) 
        for (let j = i; j > 0 && arr[j - 1] > arr[j]; j--)
            await swap(arr, j - 1, j)
}

export async function selection(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        let min = i;
        for (let j = i + 1; j < arr.length; j++)
            if (arr[j] < arr[min]) min = j;
        if (min != i) await swap(arr, min, i);
    }
}

export async function bubble(arr) {
    for (let i = 0; i < arr.length; i++)
        for (let j = 0; j < arr.length - i - 1; j++)
            if (arr[j] > arr[j + 1]) await swap(arr, j, j + 1);
}

export async function optimizedbubble(arr) {
    for (let i = 0; i < arr.length; i++) {
        let swapped = false;
        for (let j = 0; j < arr.length - i - 1; j++)
            if (arr[j] > arr[j + 1]) {
                await swap(arr, j, j + 1);
                swapped = true;
            }
        if (!swapped) break;
    }
}

export async function quick(arr, min, max) {
    if (min >= max || min < 0) return;
    const pivot = await partition(arr, min, max);
    await quick(arr, min, pivot - 1);
    await quick(arr, pivot + 1, max);
    return true;
}

export async function multiquick(arr, min, max) {
    if (min >= max || min < 0) return;
    const pivot = await partition(arr, min, max);
    await Promise.all([
        multiquick(arr, min, pivot - 1),
        multiquick(arr, pivot + 1, max)
    ]);
    return true;
}

async function partition(arr, min, max) {
    const pivot = arr[max];
    let ind = min - 1;
    for (let i = min; i < max; i++) 
        if (arr[i] < pivot && ++ind != i) 
            await swap(arr, ind, i);
    await swap(arr, ++ind, max);
    return ind;
}

export function createRadix(base = 10) {
    const bucket = Object.create(null);
    for (let i = 0; i < base; i++)
        bucket[i] = [];
    return async function radix(arr, depth = 1) {
        for (let i = 0; i < arr.length; i++) {
            let num = Math.floor((arr[i] % Math.pow(base, depth)) / Math.pow(base, depth - 1));
            bucket[num].push(arr[i]);
        }
        let i = 0;
        for (const num in bucket) 
            for (const val of bucket[num]) {
                arr[i++] = val;
                await printArr(arr, i - 1, i - 1, true);
            }
        let sorted = true;
        for (let i = 0; i < arr.length; i++)
            if (arr[i] > arr[i + 1]) {
                sorted = false;
                break;
            }
        if (!sorted) {
            for (let i = 0; i < base; i++)
                bucket[i] = [];
            await radix(arr, depth + 1);
        }
    }
}

export async function heap(arr) {
    for (let i = arr.length - 1; i >= 0; i--) {
        for (let j = i; j > 0; j--) {
            const parent = Math.floor((j - 1) / 2);
            if (arr[parent] < arr[j]) await swap(arr, parent, j);
        }
        await swap(arr, 0, i);
    }
}

export async function merge(arr, min, max, array, changes, depth = 0) {
    if (max - min <= 1) return;
    changes ??= arr.slice();
    // arr[min] > arr[max] && swap(arr, min, max);
    const half = Math.floor((min + max) / 2);
    await merge(array, min, half, arr, changes, depth + 1);
    await merge(array, half, max, arr, changes, depth + 1);
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
        await printArr(changes, k, k, true);
        // await new Promise(r => setTimeout(r, 0));
    }
    if (depth == 0) for (let i = 0; i < arr.length; i++) arr[i] = array[i];
    return true;
}

export async function multimerge(arr, min, max, array, changes, depth = 0) {
    if (max - min <= 1) return;
    changes ??= arr.slice();
    // arr[min] > arr[max] && swap(arr, min, max);
    const half = Math.floor((min + max) / 2);
    await Promise.all([
        multimerge(array, min, half, arr, changes, depth + 1),
        multimerge(array, half, max, arr, changes, depth + 1)
    ]);
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
        await printArr(changes, k, k, true);
        // await new Promise(r => setTimeout(r, 0));
    }
    if (depth == 0) for (let i = 0; i < arr.length; i++) arr[i] = array[i];
    return true;
}