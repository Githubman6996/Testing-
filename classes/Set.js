export class JSet {
    items = [];
    keys = Object.create(null);
    length = 0;
    has(val) {
        return val in this.keys;
    }
    delete(val) {
        if (!this.has(val)) return false;
        if (this.keys[val] == this.length - 1) {
            this.items.pop();
            this.length--;
            delete this.keys[val];
            return true;
        }
        let temp = this.items[this.length - 1];
        this.items[this.keys[val]] = temp;
        this.items.pop();
        this.length--;
        this.keys[temp] = this.keys[val];
        delete this.keys[val];
        return true;
    }
    add(val) {
        if (this.has(val)) return false;
        this.items.push(val);
        this.keys[val] = this.length++;
        return true;
    }
    clear() {
        this.items = [];
        this.keys = Object.create(null);
        this.length = 0;
    }
    *[Symbol.iterator]() {
        for (let i = this.length - 1; i >= 0; i--) yield this.items[i];
    }
}