import { Queue } from "./Queue.js";
import { JSet } from "./Set.js";
import { loadRender, addLine, renderArray } from "../graphics.js";
import { printArr2 } from "../out.js";
import { sorts, shuffles } from "../data.js";
// const sorts = {};

const FRAME = 0, FINISHED = 1, SORTING = 2, STATS = 3, HIGHLIGHTS = 4;
const USE_WASM = true;

const infoDiv = document.querySelector("#log");

export class Sorter {
    static formatFloat(n, x = 2, y = 1) {
    	return n.toLocaleString(undefined, {
    		minimumIntegerDigits: y,
    		minimumFractionDigits: x,
    		maximumFractionDigits: x
    	})
    }
    thread;
    frames = new Queue(); totalFrames = 0; framesPerFrame = 1;
    sorting = false; playing = false;
    getSet = new JSet(); clearSet = new JSet();
    stats = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    sort; shuffle; arr; cur; last; startedAt; rendered = 0;
    constructor() {
        this.thread = new Worker(USE_WASM ? "./threadWasm.js" : "./thread.js");
        this.onMessage = this.onMessage.bind(this);
        this.frame = this.frame.bind(this);
        this.frames._add = this.frames.add;
        this.thread.onmessage = this.onMessage;
    }
    onMessage({ data }) {
        if (data.arr) return;
        const message = new Float32Array(data);
        switch (message[0]) {
            case FRAME:
            case STATS:
            case HIGHLIGHTS:
                this.frames.add(message);
                break;
            case FINISHED:
                this.totalFrames = this.frames.length;
                this.playing = performance.now();
                this.sorting = false;
                this.frames.add([4]);
                this.startedAt = message[1];
                this.frame();
                break;
            case SORTING:
                this.frames.add = this.frames._add;
                infoDiv.textContent = "Sorting...";
                console.log("sorting");
                break;
        }
    }
    start(sort, shuffle, length, showShuffle = true) {
        if (this.playing || this.sorting) return false;
        this.arr = new Float32Array(length);
        for (let i = 0; i < length; i++) this.arr[i] = i;
        infoDiv.textContent = "Shuffling...";
        if (!showShuffle) this.frames.add = () => {};
        this.sort = sort;
        this.shuffle = shuffle;
        this.sorting = true;
        this.thread.postMessage({ action: "sort", length, sort, shuffle });
        return true;
    }
    end() {
        this.playing = false;
        this.frames.clear();
        this.totalFrames = 0;
        this.getSet.clear();
        this.clearSet.clear();
        this.sort = this.shuffle = this.arr = this.cur = this.last = this.startedAt = null;
        window.onkeydown = (e) => {
            if (e.key != "Enter" && e.key != " ") return;
            document.querySelector("#main").classList.remove("hidden");
            document.querySelector("#content").classList.add("hidden");
            window.onkeydown = null;
        }
    }
    updateSpeed(frames) {
        this.framesPerFrame = frames;
        document.querySelector("#speedSpan").innerText = frames;
    }
    frame() {
        if (!this.frames.length) {
    		if (this.sorting) requestAnimationFrame(this.frame);
    		return this.end();
    	}
    	let message, highlights = this.framesPerFrame, _;
    	for (let i = 0; i < this.framesPerFrame && this.frames.length > 0; i++) {
    	    message = this.frames.remove();
    	    if (message[0] == HIGHLIGHTS) {
    	        for (const item of this.getSet) {
	                this.getSet.delete(item);
	                this.clearSet.add(item);
	            }
	            for (let i = 1; i <= message.length; i++)
	                if (message[i] != null) {
	                    this.getSet.add(message[i]);
	                    addLine(this.arr, message[i], this.getSet, this.clearSet);
	                }
                for (const item of this.clearSet) addLine(this.arr, item, this.getSet, this.clearSet);
                for (const item of this.getSet) addLine(this.arr, item, this.getSet, this.clearSet);
    	    } else if (message[0] == STATS) {
	            [_, ...this.stats] = message;
	            --i;
	            continue;
    	    } else {
	            const [_, min, max, exclusive, time, ...data] = message;
	            this.cur = time;
	            if (exclusive) {
	                this.arr[min] = data[0];
	                this.arr[max] = data[1];
	            } else {
	                for (let i = 0; i < data.length; i++) this.arr[i] = data[i];
	                console.log(data)
	            }
	            renderArray(this.arr, Math.min(min, max), Math.max(min, max), exclusive == 1, this.getSet, this.clearSet);
    	    }
    	    this.rendered++;
    	}
    	loadRender();
    	const [gets, sets, comps, swaps, agets, asets] = this.stats;
    	const time = (performance.now() - this.playing) / 1000;
    	infoDiv.textContent = `${sorts[this.sort].cat} Sorts: ${sorts[this.sort].name} Sort (${shuffles[this.shuffle].name})
Estimated Sorting Time: ${Sorter.formatFloat(this.cur - this.startedAt, 1, 2)}ms
Animation Time ${Math.floor(time / 60)}:${Sorter.formatFloat(time % 60, 2, 2)}
${true ? "" : `Average ${Math.round(this.rendered * 1000 / (performance.now() - this.playing))} fps
~${Sorter.formatFloat((this.cur - this.last) / this.framesPerFrame, 3)}ms`}${this.frames.length} more frames
${Sorter.formatFloat(100 - this.frames.length * 100 / this.totalFrames)}% done
Array Accesses (${gets + sets + agets + asets}):
    Gets: ${gets}
    Sets: ${sets}
    Comparisons: ${comps}
    Swaps: ${swaps}${(agets || asets) ? `\nAuxillery Arrays:
    Gets: ${agets}
    Sets: ${asets}` : ""}`;
        this.last != this.cur && (this.last = this.cur);
        for (const item of this.getSet){
            this.getSet.delete(item);
            this.clearSet.add(item);
        }
	    requestAnimationFrame(this.frame);
    }
}