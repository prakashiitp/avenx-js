export class AvenxApp {
    #activeComponents = [];
    #target = null;

    constructor(config) {
        this.#target = document.querySelector(config.target);
        this.components = new Map();
        this.bridges = {};
    }

    register(name, compClass) {
        this.components.set(name, compClass);
    }

    registerBridge(name, bridgeData) {
        const self = this;
        let instance = bridgeData;

        if (typeof bridgeData === 'function') {
            try {
                instance = new bridgeData();
            } catch (e) {
                // Keep object-style bridge behavior if construction is not possible.
            }
        }

        const reactiveState = new Proxy(instance, {
            set(target, key, value) {
                target[key] = value;
                self.updateAll();
                return true;
            },
            get(target, key, receiver) {
                const value = Reflect.get(target, key, receiver);
                if (typeof value === 'function') {
                    return value.bind(receiver);
                }
                return value;
            }
        });
        this.bridges[name] = reactiveState;
    }

    updateAll() {
        this.#activeComponents.forEach(comp => comp.update());
    }

    mount(name, targetSelector = null) {
        const Comp = this.components.get(name);
        const target = targetSelector ? document.querySelector(targetSelector) : this.#target;
        if (Comp && target) {
            const compInstance = new Comp(this.bridges);
            compInstance.mount(target);
            this.#activeComponents.push(compInstance);
        }
    }
}

