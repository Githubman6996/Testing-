window.addEventListener("error", e => {
	alert(e.fileName)
	alert(e.message)
})

// let power = parseInt(prompt("Array size (size will be 2^x)"));
// while (isNaN(power)) power = parseInt(prompt("Array size (size will be 2^x)"));
let per = 1; // = Math.round(power / 2);

import {
	print,
	println,
	printArr
} from "./out.js";

import {
	renderArray,
	loadRender
} from "./graphics.js";

import { JSet } from "./Set.js";

const worker = new Worker(false ? "./thread.js" : "./threadWasm.js");


let real = 0;
let div = document.querySelector("#log");
let frames = [];

// let mult = parseInt(prompt("Input a speed multiplier"));
// while (isNaN(mult)) mult = parseInt(prompt("Input a speed multiplier"));
let sorting = true,
	playing = false,
	last, totalFrames = 0,
	rendered = 0,
	start;

// let buf = new ArrayBuffer(4 * (2 << power - 1));
let arr, buf;

const audioCtx = new AudioContext();
const oscillatorNode = audioCtx.createOscillator();
const gainNode = audioCtx.createGain();

oscillatorNode.connect(gainNode);
gainNode.connect(audioCtx.destination);

oscillatorNode.type = 'sine';
gainNode.gain.value = 1;

let startMs = Date.now(),
	endMs = 0;

function Node(val) {
	this.val = val;
	this.next = null;
}
let getSet = new JSet(),
	clearSet = new JSet();
let temp, gets = 0,
	comps = 0,
	sets = 0,
	swaps = 0,
	agets = 0,
	acomps = 0,
	asets = 0,
	aswaps = 0
worker.onmessage = async e => {
	if (e.data.arr) renderArray(e.data.arr, e.data.min, e.data.max, e.data.ex)
	let message = new Float32Array(e.data);
	// return renderArray(message.slice(5), message[1], message[2], message[3] == 1);
	if (message[0] == 0 || message[0] == 3 || message[0] == 4) {
		frames.push(message);
		totalFrames++;
	} else if (message[0] == 1) {
		sorting = false;
		// div.textContent = "Click to Play";
		// window.onclick = () => {
		//     // oscillatorNode.start();
		//     window.onclick = null;
		startMs = start = performance.now();
		playing = true;
		frames.push([4])
		frame();
		// }
	} else if (message[0] == 2) {
		// alert("a")
		div.textContent = "Sorting...";
		frames = [];
		// startMs = performance.now();
	}
	// else if (message[0] == 3) {
	//     frames.push(message);
	// }
}

const speedinp = document.querySelector("#speed");
const sizeDiv = document.querySelector("#size");
sizeDiv.value = innerWidth;

function log(n, base) {
	return Math.log(n) / Math.log(base);
}
sizeDiv.onchange = e => {
	const exp = log(+sizeDiv.value, 2)
	speedinp.max = Math.floor(64 / exp) // * 2;
	speedinp.min = 1 / exp;
	speedinp.value = Math.min(speedinp.max, speedinp.value);
	// alert(speedinp.max)
}
let lastC;
let cur;
function frame() {
	if (!frames.length) {
		if (sorting) requestAnimationFrame(frame);
		return;
	}
	let count = per * +speedinp.value,
		highlights = count;
	for (let i = 0; i < count && frames.length > 0; i++) {
		rendered++;
		const message = frames.shift();
		if (message[0] == 4) {
			// console.log(message)
			for (const item of getSet) {
				getSet.delete(item);
				clearSet.add(item);
			}
			for (let i = 1; i <= message.length; i++)(message[i] != null) && getSet.add(message[i]);
			// console.log(getSet);
			// continue;
		} else if (message[0] == 3) {
			[temp, gets, sets, comps, swaps, agets, asets, acomps, aswaps] = message;
			i--;
			// printArr(buf, message[1], message[2], message[3] == 1, getSet);
			if (--highlights <= 0) break;
			// continue;
		} else {
			cur = message[4];
			message[4] < startMs && (startMs = message[4]);
			message[4] > endMs && (endMs = message[4]);
			if (message[3] == 1) {
				arr[message[1]] = message[5];
				arr[message[2]] = message[6];
				const m = message[5] / arr.length;
				// oscillatorNode.frequency.value = m * 900 + 100;

				// gainNode.gain.value = 2 - m*2;
			} else
				for (let i = 0; i < arr.length; i++) arr[i] = message[i + 5];
		}
		printArr(buf, message[1], message[2], message[3] == 1, getSet, clearSet);
		// if (message[3] == 0) break;
	}
	loadRender();
	window.time = 1000 / (cur - last);
	const time = (performance.now() - start) / 1000;
	const seconds = time % 60;
	const minutes = ~~(time / 60);
	div.textContent = `Estimated Sorting Time: ${formatFloat(cur - startMs, 2, 2)}ms
Time ${minutes}:${formatFloat(seconds, 2, 2)}
Average ${Math.round(rendered * 1000 / (performance.now() - start))} fps
~${formatFloat((cur - last) / count, 3)}ms
${frames.length} more frames
${formatFloat(100 - frames.length * 100 / totalFrames)}% done
${formatFloat(endMs -  startMs, 2, 2)}
Array Accesses (${gets + sets + agets + asets}):
    Gets: ${gets}
    Sets: ${sets}
    Comparisons: ${comps}
    Swaps: ${swaps}
\nAuxillery Arrays:
    Gets: ${agets}
    Sets: ${asets}`;
	last = cur;
	// setTimeout(() => 
	requestAnimationFrame(frame)
	// , 100);
}

function formatFloat(n, x = 2, y = 1) {
	return n.toLocaleString(undefined, {
		minimumIntegerDigits: y,
		minimumFractionDigits: x,
		maximumFractionDigits: x
	})
}
const startBut = document.querySelector("#start");
div.textContent = "Awaiting Play..."
startBut.onclick = () => {
	// if (!sizeDiv.value)
	// alert("starting");
	// startBut.style.display = sizeDiv.style.display = "none";
	let length = +sizeDiv.value;
	per = Math.round(log(+sizeDiv.value, 2) / 4);
	arr = new Float32Array(length);
	buf = arr.buffer;
	startMs = Date.now(),
	endMs = 0;
	gets = new Float32Array(length);
	div.textContent = "Shuffling...";
	worker.postMessage({
		action: "sort",
		length,
		sort: document.querySelector("#sort-select").value
	});
}
// let ooga = 10,
//     length = 2 << ooga;
//     per = Math.round(ooga / 2);
//     arr = new Float32Array(length);
//     buf = arr.buffer;
//     div.textContent = "Shuffling...";
//     worker.postMessage({
//         action: "sort",
//         length,
//         sort: "optimizedBubble"
//     });