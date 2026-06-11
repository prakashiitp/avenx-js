class ExpressionParser {
    parseState(content) {
        const state = {};
        const match = content.match(/<state\s+(.*?)\s*\/>/);
        if (match) {
            match[1].match(/(\w+)="([^"]*)"/g)?.forEach(pair => {
                const [k, v] = pair.split('=');
                const val = v.replace(/"/g, '');
                state[k] = isNaN(val) ? val : Number(val);
            });
        }
        return state;
    }

    parseComputed(content) {
        const computed = {};
        const regex = /<computed\s+name="(\w+)"\s+value="([^"]*)"\s*\/>/g;
        let m;
        while ((m = regex.exec(content)) !== null) {
            computed[m[1]] = m[2];
        }
        return computed;
    }

    parseMethods(content) {
        const methods = {};
        const actionRegex = /<action\s+name="(\w+)">([\s\S]*?)<\/action>/g;
        let m;
        while ((m = actionRegex.exec(content)) !== null) {
            methods[m[1]] = m[2].trim().replace(/\s+/g, ' ');
        }
        return methods;
    }
}

module.exports = ExpressionParser;

