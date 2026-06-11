const fs = require('fs');
const path = require('path');
const ExpressionParser = require('./expressionParser');

/**
 * ComponentParser handles the parsing of Avenx Template (.axt) and Avenx Design (.axd) files.
 * It extracts component state, methods, and templates, and coordinates with the StyleProcessor
 * to handle scoped styles and CSS variables.
 */
class TemplateParser {
    /**
     * Creates an instance of ComponentParser.
     * @param {StyleProcessor} styleProcessor - An instance of StyleProcessor to handle styles.
     */
    constructor(styleProcessor) {
        /** @type {StyleProcessor} */
        this.styleProcessor = styleProcessor;
        /** @type {ExpressionParser} */
        this.expressionParser = new ExpressionParser();
    }

    /**
     * Parses a .component.js file and its corresponding .component.css file into a JavaScript class string.
     * @param {string} filePath - The absolute path to the .component.js file.
     * @returns {string} The generated JavaScript class for the component.
     */
    parse(filePath) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const fileName = path.basename(filePath, '.component.js');
        
        // Convert user-profile or user_profile to UserProfile
        const name = fileName
            .split(/[-_]/)
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join('');

        const desPath = filePath.replace('.component.js', '.component.css');
        let desBlocks = {};

        if (fs.existsSync(desPath)) {
            this.extractStylesAndVars(fs.readFileSync(desPath, 'utf-8'), desBlocks);
        }

        const state = this.extractState(content);
        const computed = this.extractComputed(content);
        const methods = this.extractMethods(content);
        let template = this.extractTemplate(content, desBlocks, name);

        const methodStrings = Object.entries(methods)
            .map(([k, v]) => `${k}: \`${v}\``).join(',\n        ');

        return `
class ${name} extends AvenxComponent {
    constructor(bridges) {
        super(${JSON.stringify(state)}, ${JSON.stringify(computed)}, bridges, \`${template}\`, { ${methodStrings} });
    }
}`;
    }

    /**
     * Extracts global CSS variables and component-specific style blocks from .axd content.
     * @param {string} desContent - The content of the .axd file.
     * @param {Object} desBlocks - An object to store the extracted style blocks.
     * @private
     */
    extractStylesAndVars(desContent, desBlocks) {
        const globalMatch = desContent.match(/<@global>([\s\S]*?)<\/ @global>/i);
        if (globalMatch) {
            let inner = globalMatch[1];
            const defRegex = /@def\s+([\w-]+)\s+([^;]+);/g;
            let defMatch;
            while ((defMatch = defRegex.exec(inner)) !== null) {
                this.styleProcessor.addVariable(defMatch[1], defMatch[2].trim());
            }
            
            // Remove @def lines and add the rest as global CSS
            const rawCss = inner.replace(/@def\s+[\w-]+\s+[^;]+;/g, '').trim();
            if (rawCss) {
                this.styleProcessor.addGlobalCSS(rawCss);
            }
        }

        const cssBlockMatch = desContent.match(/<@css>([\s\S]*?)<\/ @css>/i);
        if (cssBlockMatch) {
            const inner = cssBlockMatch[1];
            let depth = 0, currentName = "", currentBody = "", inBlock = false;
            for (let i = 0; i < inner.length; i++) {
                const char = inner[i];
                if (char === '{' && depth === 0) {
                    currentName = inner.substring(0, i).trim().split('}').pop().trim();
                    inBlock = true; depth++;
                } else if (char === '{') {
                    depth++; currentBody += char;
                } else if (char === '}') {
                    depth--;
                    if (depth === 0) {
                        if (currentName) desBlocks[currentName] = currentBody.trim();
                        currentBody = ""; currentName = ""; inBlock = false;
                    } else { currentBody += char; }
                } else if (inBlock) { currentBody += char; }
            }
        }
    }

    /**
     * Extracts the initial state from the component's <state /> tag.
     * @param {string} content - The content of the .axt file.
     * @returns {Object} The extracted state object.
     * @private
     */
    extractState(content) {
        return this.expressionParser.parseState(content);
    }

    /**
     * Extracts computed properties from the component's <computed /> tags.
     * @param {string} content - The content of the .axt file.
     * @returns {Object} A map of property names to their expression strings.
     * @private
     */
    extractComputed(content) {
        return this.expressionParser.parseComputed(content);
    }

    /**
     * Extracts actions (methods) from the component's <action /> tags.
     * @param {string} content - The content of the .axt file.
     * @returns {Object<string, string>} A map of method names to their stringified bodies.
     * @private
     */
    extractMethods(content) {
        return this.expressionParser.parseMethods(content);
    }

    /**
     * Extracts the HTML template, removes meta tags, and processes internal styles.
     * @param {string} content - The content of the .axt file.
     * @param {Object} desBlocks - The previously extracted design blocks.
     * @param {string} name - The name of the component for style hashing.
     * @returns {string} The cleaned and processed HTML template.
     * @private
     */
    extractTemplate(content, desBlocks, name) {
        let template = content
            .replace(/<state.*? \/>/g, '')
            .replace(/<computed.*? \/>/g, '')
            .replace(/<action.*?>[\s\S]*?<\/action>/g, '')
            .trim();
        template = this.styleProcessor.process(template, desBlocks, name);
        return template.split('\n').filter(line => line.trim() !== '').join('\n');
    }
}

module.exports = TemplateParser;
