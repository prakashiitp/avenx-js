/**
 * AvenxComponent is the base class for all Avenx components.
 * It provides core functionality for reactivity, template rendering, and event binding.
 * It uses a Proxy-based state management system to automatically trigger re-renders on state changes.
 */
export class AvenxComponent {
    /** 
     * The DOM element the component is mounted to.
     * @type {HTMLElement|null} 
     * @private
     */
    #element = null;
    
    /** 
     * The raw HTML template string with interpolation placeholders.
     * @type {string} 
     * @private
     */
    #template = '';
    
    /** 
     * A map of component-specific methods.
     * @type {Object<string, Function>} 
     * @private
     */
    #methods = {};
    
    /** 
     * A map of shared reactive states (bridges) accessible to the component.
     * @type {Object} 
     * @private
     */
    #bridges = {};

    /**
     * Creates an instance of AvenxComponent.
     * @param {Object} [initialState={}] - The initial local state of the component.
     * @param {Object} [bridges={}] - Shared reactive states (bridges) accessible to the component.
     * @param {string} [template=''] - The HTML template for the component.
     * @param {Object} [methods={}] - A map of methods available to the component's context.
     */
    constructor(initialState = {}, bridges = {}, template = '', methods = {}) {
        this.#template = template;
        this.#bridges = bridges;
        const self = this;

        /**
         * The reactive state of the component. 
         * Changes to this object trigger an automatic re-render via the Proxy's set trap.
         * @type {Proxy}
         */
        this.state = new Proxy(initialState, {
            set(target, key, value) {
                target[key] = value;
                self.update();
                return true;
            },
            get(target, key) {
                return target[key];
            }
        });

        // Turn action code strings into executable functions with state context
        this.#methods = {};
        for (let [key, code] of Object.entries(methods)) {
            const self = this;
            this.#methods[key] = function(...args) {
                const context = { ...self.state, ...self.#methods, ...self.#bridges, args };
                const fn = new Function(...Object.keys(context), `with(this) { ${code} }`);
                return fn.call(self.state, ...Object.values(context));
            }.bind(this.state);
        }
    }

    /**
     * Executes a string of JavaScript code within the combined context of the component's state,
     * methods, and accessible bridges.
     * @param {string} code - The JavaScript code to execute.
     * @param {Event|null} [event=null] - The event object, if the execution was triggered by a DOM event.
     * @private
     */
    #execute(code, event = null) {
        const context = { ...this.state, ...this.#methods, ...this.#bridges, event };
        try {
            const fn = new Function(...Object.keys(context), `with(this) { ${code} }`);
            fn.call(this.state, ...Object.values(context));
        } catch (e) { console.error("Avenx Exec Error:", e); }
    }

    /**
     * Renders the component's template by interpolating expressions (e.g., {{ expression }}).
     * @returns {string} The interpolated HTML string.
     */
    render() {
        let html = this.#template;
        return html.replace(/\{\{\s*(.*?)\s*\}\}/g, (_, expr) => {
            const context = { ...this.state, ...this.#bridges };
            try {
                return new Function(...Object.keys(context), `return ${expr}`).call(this.state, ...Object.values(context));
            } catch (e) { 
                console.warn("Avenx Render Warning:", e, "Expression:", expr);
                return ''; 
            }
        });
    }

    /**
     * Updates the component's DOM element by re-rendering the template and re-binding all events.
     */
    update() {
        if (!this.#element) return;
        this.#element.innerHTML = this.render();
        this.#bindEvents();
    }

    /**
     * Scans the component's DOM for attributes starting with '@' (e.g., @click)
     * and binds them as event listeners that execute the attribute's value as code.
     * @private
     */
    #bindEvents() {
        this.#element.querySelectorAll('*').forEach(el => {
            Array.from(el.attributes).forEach(attr => {
                if (attr.name.startsWith('@')) {
                    const eventName = attr.name.substring(1);
                    el.addEventListener(eventName, (e) => {
                        this.#execute(attr.value, e);
                    });
                }
            });
        });
    }

    /**
     * Mounts the component to a specific target DOM element and triggers the initial render.
     * @param {HTMLElement} target - The DOM element where the component should be mounted.
     */
    mount(target) {
        this.#element = target;
        this.update();
    }
}
