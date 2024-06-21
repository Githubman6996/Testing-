class Node {
    data; next;
    constructor(val) {
        this.data = val;
    }
}

export class Queue {
    head = new Node();
    end = this.head;
    length = 0;
    add(val) {
        this.end = this.end.next = new Node(val);
        ++this.length;
    }
    remove() {
        if (!this.head.next) return null;
        const value = this.head.next.data;
        this.head = this.head.next;
        delete this.head.data;
        --this.length;
        return value;
    }
    peek() {
        return this.head.next.data;
    }
    clear() {
        this.end = this.head = new Node();
        this.length = 0;
    }
    *[Symbol.iterator]() {
        let cur = this.head;
        while (cur.next) {
            yield cur.next.data;
            cur = cur.next;
        }
    }
}