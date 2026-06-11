import { ComputedRegistry } from '../reactive/createComputed.js';
import { StateFactory } from '../reactive/createState.js';
import { TemplateRenderer } from '../renderer/renderTemplate.js';
import { DomPatcher } from '../renderer/domPatch.js';
import { EventBinder } from '../events/bindEvents.js';
import { EventExecutor } from '../events/eventExecutor.js';
import { DynamicEvaluator } from '../security/evaluator.js';
import { LifecycleManager } from './lifecycle.js';

export class AvenxComponent {
    #element = null;
    #template = '';
    #methods = {};
    #bridges = {};
    #computed;
    #renderer;
    #patcher;
    #eventBinder;
    #eventExecutor;
    #evaluator;
    #lifecycle;

    constructor(initialState = {}, computed = {}, bridges = {}, template = '', methods = {}) {
        this.#template = template;
        this.#bridges = bridges;
        this.#computed = new ComputedRegistry(computed);
        this.#renderer = new TemplateRenderer();
        this.#patcher = new DomPatcher();
        this.#eventBinder = new EventBinder();
        this.#evaluator = new DynamicEvaluator();
        this.#lifecycle = new LifecycleManager();

        this.state = new StateFactory().create(initialState, {
            computedKeys: this.#computed.keys(),
            onChange: () => this.update(),
            getComputedValue: key => this.#evaluateComputed(key)
        });

        this.#methods = this.#evaluator.createMethodMap(
            methods,
            executableMethods => this.#createScope(executableMethods),
            () => this.state
        );
        this.#eventExecutor = new EventExecutor((source, event) => this.#runEventHandler(source, event));
    }

    #createScope(methods = this.#methods, extras = {}) {
        return { ...this.state, ...methods, ...this.#bridges, ...extras };
    }

    #evaluateComputed(key) {
        const expression = this.#computed.get(key);
        try {
            return this.#evaluator.evaluateExpression(expression, this.#createScope(), this.state);
        } catch (error) {
            console.warn("Avenx Computed Error:", error, "Expression:", expression);
            return undefined;
        }
    }

    #resolveTemplateExpression(expression) {
        return this.#evaluator.evaluateExpression(expression, this.#createScope(), this.state);
    }

    #runEventHandler(source, event) {
        try {
            return this.#evaluator.executeStatement(source, this.#createScope(this.#methods, { event }), this.state);
        } catch (error) {
            console.error("Avenx Exec Error:", error);
            return undefined;
        }
    }

    render() {
        return this.#renderer.render(this.#template, expression => this.#resolveTemplateExpression(expression));
    }

    update() {
        if (!this.#element) return;
        this.#patcher.patch(this.#element, this.render());
        this.#eventBinder.bind(this.#element, this.#eventExecutor);
    }

    __setMountTarget(target) {
        this.#element = target;
    }

    mount(target) {
        this.#lifecycle.mount(this, target);
    }
}
