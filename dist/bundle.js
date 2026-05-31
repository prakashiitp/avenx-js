/**
 * AvenxComponent is the base class for all Avenx components.
 * It provides core functionality for reactivity, template rendering, and event binding.
 * It uses a Proxy-based state management system to automatically trigger re-renders on state changes.
 */
class AvenxComponent {
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

/**
 * AvenxApp is the main orchestrator for an Avenx application.
 * It manages the registration of component classes, the creation and management of shared reactive states (bridges),
 * and the mounting of component instances to the DOM.
 */
class AvenxApp {
    /** 
     * A list of all currently active (mounted) component instances.
     * @type {AvenxComponent[]} 
     * @private
     */
    #activeComponents = [];
    
    /** 
     * The default target DOM element for mounting the application.
     * @type {HTMLElement|null} 
     * @private
     */
    #target = null;

    /**
     * Creates an instance of AvenxApp.
     * @param {Object} config - The application configuration.
     * @param {string} config.target - The CSS selector for the main application container.
     */
    constructor(config) {
        this.#target = document.querySelector(config.target);
        /**
         * A map of registered component names to their respective class constructors.
         * @type {Map<string, typeof AvenxComponent>}
         */
        this.components = new Map();
        /**
         * A map of shared reactive state objects (bridges).
         * @type {Object<string, Proxy>}
         */
        this.bridges = {};
    }

    /**
     * Registers a component class under a specific name, making it available for mounting.
     * @param {string} name - The unique name for the component.
     * @param {typeof AvenxComponent} compClass - The component class constructor.
     */
    register(name, compClass) { 
        this.components.set(name, compClass); 
    }
    
    /**
     * Registers a shared reactive state object (bridge). 
     * Changes to a bridge's state will automatically trigger a re-render for all active components.
     * @param {string} name - The unique name for the bridge.
     * @param {Object} initialState - The initial state data for the bridge.
     */
    registerBridge(name, initialState) {
        const self = this;
        const reactiveState = new Proxy(initialState, {
            set(target, key, value) {
                target[key] = value;
                self.updateAll();
                return true;
            },
            get(target, key) {
                return target[key];
            }
        });
        this.bridges[name] = reactiveState;
    }

    /**
     * Triggers an update (re-render) for every active (mounted) component instance in the application.
     */
    updateAll() {
        this.#activeComponents.forEach(comp => comp.update());
    }

    /**
     * Mounts a registered component to a specific target element.
     * Creates a new instance of the component class and provides it with access to all registered bridges.
     * @param {string} name - The name of the registered component to mount.
     * @param {string|null} [targetSelector=null] - The CSS selector for the target mount point. 
     * If null, the application's default target is used.
     */
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

class Counter extends AvenxComponent {
    constructor(bridges) {
        super({"count":0,"step":1}, bridges, `<div class="avenx-36f2fd3e">
    <h1 @click="count = 0">
        Avenx-JS @css PoC
    </h1>
    <div>
        {{ count }}
    </div>
    <button @click="count += step; log()">
        Erhöhen (+{{ step }})
    </button>
</div>`, { log: `console.log("Neuer Stand:", count);` });
    }
}
class Display extends AvenxComponent {
    constructor(bridges) {
        super({}, bridges, `<div>
    <div>
        Globaler Brücken-Zähler
    </div>
    <div>
        {{ CounterBridge.count }}
    </div>
</div>`, {  });
    }
}
class Source extends AvenxComponent {
    constructor(bridges) {
        super({}, bridges, `<div>
    <div>
        Brücken-Steuerung
    </div>
    <button @click="CounterBridge.count++">
        Zähler erhöhen
    </button>
</div>`, {  });
    }
}
class TestComp extends AvenxComponent {
    constructor(bridges) {
        super({"count":0}, bridges, `<div class="avenx-ed153e1d">
    <h1>Test-comp Component</h1>
    <p>Current count: {{ count }}</p>
    <button @click="count++">Increment</button>
    <button @click="reset()">Reset</button>
</div>`, { reset: `count = 0;` });
    }
}
class UserProfile extends AvenxComponent {
    constructor(bridges) {
        super({"count":0}, bridges, `<div class="avenx-87b2c0b9">
    <h1 class="avenx-b965a092">UserProfile Component</h1>
    <p class="avenx-99bdf38c">Current count: {{ count }}</p>
    <button @click="count++" class="avenx-4beeefa1">Increment</button>
    <button @click="reset()" class="avenx-4beeefa1">Reset</button>
</div>`, { reset: `count = 0;` });
    }
}
(function(){





const app = new AvenxApp({ target: '#app' });
app.registerBridge('CounterBridge', {
    count: 0
});


app.register('Source', Source);
app.register('Display', Display);
app.register('UserProfile', UserProfile);

app.mount('Source', '#source');
app.mount('Display', '#display');

})();