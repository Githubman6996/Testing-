// import { clearLines } from "./graphics.js";
import { print, println, printArr, logElement } from "./out.js";

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

let toPrint = [];
export async function bogo(arr) {
    let sorted = false;
    while (!sorted) {
        arr.shuffle();
        sorted = true;
        for (let i = 0; i < arr.length - 1; i++) if (await arr.compare(i, i + 1) > 0) {
            sorted = false;
            break;
        }
    }
}

export async function insertion(arr) {
    for (let i = 1; i < arr.length; i++) 
        for (let j = i; j > 0 && await arr.compare(j - 1, j) > 0; j--)
            await arr.swap(j - 1, j);
}

export async function selection(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        let min = i;
        for (let j = i + 1; j < arr.length; j++) {
            if (await arr.compare(j, min) < 0) min = j;
        }
        if (min != i) await arr.swap(min, i);
    }
}

export async function doubleselection(arr) {
    for (let i = 0; i < arr.length / 2; i++) {
        let min = i, max = i;
        for (let j = i + 1; j < arr.length - i; j++) {
            if (await arr.compare(j, min) < 0) min = j;
            if (await arr.compare(j, max) >= 0) max = j;
        }
        if (min != i) await arr.swap(min, i);
        if (max == i) max = min;
        if (max != arr.length - i - 1) await arr.swap(max, arr.length - i - 1);
    }
}

export async function bubble(arr) {
    for (let i = 0; i < arr.length; i++)
        for (let j = 0; j < arr.length - i - 1; j++)
            if (await arr.compare(j, j + 1) > 0) await arr.swap(j, j + 1);
}

export async function optimizedbubble(arr) {
    for (let i = 0; i < arr.length; i++) {
        let swapped = false;
        for (let j = 0; j < arr.length - i - 1; j++) if (await arr.compare(j, j + 1) > 0) {
            await arr.swap(j, j + 1);
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
    let ind = min - 1;
    for (let i = min; i < max; i++) {
        if (await arr.compare(i, max) < 0 && ++ind != i) 
            await arr.swap(ind, i);
    }
    await arr.swap(++ind, max);
    return ind;
}

export function createRadix(base = 10) {
    const bucket = Object.create(null);
    for (let i = 0; i < base; i++)
        bucket[i] = [];
    return async function radix(arr, depth = 1) {
        for (let i = 0; i < arr.length; i++) {
            let val = await arr.get(i);
            let num = Math.floor((val % Math.pow(base, depth)) / Math.pow(base, depth - 1));
            bucket[num].push(val);
        }
        let i = 0;
        for (const num in bucket) 
            for (const val of bucket[num]) {
                await arr.set(i++, val);
                await printArr(arr, i - 1, i - 1, true);
            }
        if (!(await arr.sorted)) {
            arr.comparing.clear();
            for (let i = 0; i < base; i++)
                bucket[i] = [];
            await radix(arr, depth + 1);
        }
    }
}

export async function heap(arr) {
    let start = Math.floor(arr.length / 2), end = arr.length;
    while (end > 1) {
        if (start > 0) start--;
        else {
            end--;
            await arr.swap(end, 0);
        }
        let root = start;
        while (root * 2 + 1 < end) {
            let child = root * 2 + 1;
            if (child + 1 < end && await arr.compare(child, child + 1) < 0) child++;
            if (await arr.compare(root, child) >= 0) break;
            await arr.swap(root, child);
            root = child;
        }
    }
}

export async function merge(arr, min, max, array, changes, depth = 0) {
    if (max - min <= 1) return;
    if (!array && !arr.aux) arr.createAux();
    array ??= arr.aux;
    changes ??= arr.copy();
    const half = Math.floor((min + max) / 2);
    await merge(array, min, half, arr, changes, depth + 1);
    await merge(array, half, max, arr, changes, depth + 1);
    let i = min, j = half;
    for (let k = min; k < max; k++) {
        let first = await arr.get(i, true), second = await arr.get(j, true), cache = await array.get(k, true);
        if (i < half && (j >= max || first <= second)) {
            await changes.set(k, await array.set(k, first, true));
            i++;
        } else {
            await changes.set(k, await array.set(k, second, true));
            j++;
        }
        if (await changes.get(k) != cache) await printArr(changes, k, k, true);
        // await new Promise(r => setTimeout(r, 0));
    }
    if (depth == 0) for (let i = 0; i < arr.length; i++) await arr.set(i, await array.get(i));
    return true;
}

export async function multimerge(arr, min, max, array, changes, depth = 0) {
    if (max - min <= 1) return;
    if (!array && !arr.aux) arr.createAux();
    array ??= arr.aux;
    changes ??= arr.copy();
    const half = Math.floor((min + max) / 2);
    await Promise.all([
        multimerge(array, min, half, arr, changes, depth + 1),
        multimerge(array, half, max, arr, changes, depth + 1)
    ]);
    let i = min, j = half;
    for (let k = min; k < max; k++) {
        let first = await arr.get(i, true), second = await arr.get(j, true), cache = await array.get(k, true);
        if (i < half && (j >= max || first <= second)) {
            await changes.set(k, await array.set(k, first, true));
            i++;
        } else {
            await changes.set(k, await array.set(k, second, true));
            j++;
        }
        // await new Promise(r => setTimeout(r, 0));
    }
    if (depth == 0) for (let i = 0; i < arr.length; i++) await arr.set(i, await array.get(i));
    return true;
}