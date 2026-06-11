export class DynamicEvaluator {
    #toScopeBindings(scope = {}) {
        const names = [];
        const values = [];

        for (const [name, value] of Object.entries(scope)) {
            if (/^[A-Za-z_$][\w$]*$/.test(name)) {
                names.push(name);
                values.push(value);
            }
        }

        return { names, values };
    }

    evaluateExpression(expression, scope = {}, thisArg = scope) {
        const { names, values } = this.#toScopeBindings(scope);
        const fn = new Function(...names, `return (${expression})`);
        return fn.call(thisArg, ...values);
    }

    executeStatement(source, scope = {}, thisArg = scope) {
        const { names, values } = this.#toScopeBindings(scope);
        const fn = new Function(...names, `with(this) { ${source} }`);
        return fn.call(thisArg, ...values);
    }

    createMethodMap(methods = {}, getScope, getThisArg) {
        const executable = {};

        for (const [name, source] of Object.entries(methods)) {
            executable[name] = (...args) => this.executeStatement(
                source,
                { ...getScope(executable), args },
                getThisArg()
            );
        }

        return executable;
    }
}
