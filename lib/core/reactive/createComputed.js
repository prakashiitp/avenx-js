export class ComputedRegistry {
    constructor(computed = {}) {
        this.computed = computed || {};
    }

    keys() {
        return Object.keys(this.computed);
    }

    has(key) {
        return Object.prototype.hasOwnProperty.call(this.computed, key);
    }

    get(key) {
        return this.computed[key];
    }

    all() {
        return this.computed;
    }
}
