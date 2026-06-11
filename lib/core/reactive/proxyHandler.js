export class ProxyHandlerFactory {
    constructor({
        computedKeys = [],
        onChange = () => {},
        getComputedValue = () => undefined
    } = {}) {
        this.computedKeys = new Set(computedKeys);
        this.onChange = onChange;
        this.getComputedValue = getComputedValue;
    }

    create() {
        return {
            set: (target, key, value) => this.set(target, key, value),
            get: (target, key) => this.get(target, key),
            ownKeys: target => this.ownKeys(target),
            getOwnPropertyDescriptor: (target, key) => this.getOwnPropertyDescriptor(target, key)
        };
    }

    set(target, key, value) {
        target[key] = value;
        this.onChange();
        return true;
    }

    get(target, key) {
        if (this.computedKeys.has(key)) {
            return this.getComputedValue(key, target);
        }
        return target[key];
    }

    ownKeys(target) {
        return [...Reflect.ownKeys(target), ...this.computedKeys];
    }

    getOwnPropertyDescriptor(target, key) {
        if (this.computedKeys.has(key)) {
            return { enumerable: true, configurable: true };
        }
        return Reflect.getOwnPropertyDescriptor(target, key);
    }
}
