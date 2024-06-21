import { renderArray, clearCompares } from "./graphics.js";

let real = 0;
export default class Sortable {
    data; aux; #temp; comparing = new Set();
    reads = 0; writes = 0; swaps = 0; comparasion = 0;
    constructor(size=0, data) {
        this.data = data ? data.slice() : new Array(size).fill().map((_, i) => i);
    }
    get sorted() {
        return new Promise(async r => {    
            for (let i = 0; i < this.data.length - 1; i++) if (await this.compare(i, i + 1) > 0) return r(false);
            return r(true);
        })
    }
    copy() {
        return new Sortable(this.data.length, this.data);
    }
    createAux() {
        // if (this.aux != null) return;
        this.aux = new Sortable(this.data.length, this.data);
        this.aux.aux = this;
    }
    get length() {
        return this.data.length;
    }
    async get(i, merge) {
        this.reads++;
        // const keep = this.comparing.has(i);
        // this.comparing.add(i);
        // if (!merge) await renderArray(this, i, i, true, true);
        // if (!keep) {
        //     this.comparing.delete(i);
        //     clearCompares(this, ...this.comparing);
        // }
        return this.data[i];
    }
    async set(i, v, merge) {
        this.writes++;
        // if (!merge) await renderArray(this, i, i, true, true);
        return this.data[i] = v;
    }
    async swap(i, j) {
        this.swaps++;
        this.#temp = await this.get(i);
        await this.set(i, await this.get(j));
        await this.set(j, await this.#temp);
        return renderArray(this, Math.min(i, j), Math.max(j, i), true);
    }
    async compare(i, j) {
        this.comparasion++;
        clearCompares(this, i, j);
        this.comparing.add(i).add(j);
        // if (this.comparasion < 10) alert([...this.comparing].join(","))
        let res = (await this.get(i)) - (await this.get(j));
        // if (this.comparasion < 10) alert([...this.comparing].join(","))
        return res;
    }
    async shuffle() {
        let cur = this.data.length;
        while (cur > 0) {
            let ind = Math.floor(Math.random() * cur);
            cur--;
            await this.swap(ind, cur);
        }
    }
}

window.Sortable = Sortable;