export class EventBinder {
    #boundEvents = new WeakMap();

    bind(root, dispatcher) {
        root.querySelectorAll('*').forEach(el => {
            Array.from(el.attributes).forEach(attr => {
                if (attr.name.startsWith('@')) {
                    const eventName = attr.name.substring(1);
                    const signature = `${eventName}:${attr.value}`;
                    const existing = this.#boundEvents.get(el) || new Set();

                    if (!existing.has(signature)) {
                        el.addEventListener(eventName, event => dispatcher.execute(attr.value, event));
                        existing.add(signature);
                        this.#boundEvents.set(el, existing);
                    }
                }
            });
        });
    }
}
