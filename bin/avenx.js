#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const AvenxCompiler = require('../lib/compiler');

const [, , command, ...args] = process.argv;

/**
 * Avenx CLI - Command Line Interface for Avenx-JS.
 */
class AvenxCLI {
    constructor() {
        this.baseDir = process.cwd();
        this.frameworkDir = path.join(__dirname, '..');
    }

    run(command, args) {
        switch (command) {
            case 'init':
                this.initProject();
                break;
            case 'generate':
            case 'g':
                this.generateComponent(args[0]);
                break;
            case 'build':
                this.buildProject();
                break;
            case 'help':
            default:
                this.printHelp();
                break;
        }
    }

    /**
     * Initializes a new Avenx project structure.
     */
    initProject() {
        console.log('🚀 Initializing new Avenx-JS project...');
        const dirs = [
            'src/components',
            'src/global',
            'dist'
        ];

        dirs.forEach(dir => {
            const fullPath = path.join(this.baseDir, dir);
            if (!fs.existsSync(fullPath)) {
                fs.mkdirSync(fullPath, { recursive: true });
                console.log(`  Created: ${dir}`);
            }
        });

        // Create initial index.html
        const indexHtmlPath = path.join(this.baseDir, 'index.html');
        if (!fs.existsSync(indexHtmlPath)) {
            fs.writeFileSync(indexHtmlPath, this.getInitialHtml());
            console.log('  Created: index.html');
        }

        // Create initial main.app.js
        const mainAppPath = path.join(this.baseDir, 'src/main.app.js');
        if (!fs.existsSync(mainAppPath)) {
            fs.writeFileSync(mainAppPath, "import { AvenxApp } from 'avenx-js/runtime';\n\nconst app = new AvenxApp({ target: '#app' });\n");
            console.log('  Created: src/main.app.js');
        }

        console.log('✅ Project initialized successfully!');
    }

    /**
     * Generates a new component folder and template files, and registers it in main.app.js.
     */
    generateComponent(name) {
        if (!name) {
            console.error('❌ Error: Please provide a component name (e.g., avenx g my-component)');
            return;
        }

        const lowerName = name.toLowerCase();
        // Convert user-profile or user_profile to UserProfile
        const capitalizedName = lowerName
            .split(/[-_]/)
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join('');
        
        const compDir = path.join(this.baseDir, 'src/components', lowerName);

        if (fs.existsSync(compDir)) {
            console.error(`❌ Error: Component '${lowerName}' already exists.`);
            return;
        }

        fs.mkdirSync(compDir, { recursive: true });

        const jsTemplate = fs.readFileSync(path.join(this.frameworkDir, 'templates/component/component.js.template'), 'utf-8');
        const cssTemplate = fs.readFileSync(path.join(this.frameworkDir, 'templates/component/component.css.template'), 'utf-8');

        fs.writeFileSync(
            path.join(compDir, `${lowerName}.component.js`),
            jsTemplate.replace('{{ name }}', capitalizedName)
        );
        fs.writeFileSync(
            path.join(compDir, `${lowerName}.component.css`),
            cssTemplate
        );

        console.log(`✅ Component '${lowerName}' generated at src/components/${lowerName}/`);
        this.registerInMainApp(capitalizedName, lowerName);
    }

    /**
     * Automatically adds import and registration for a component in src/main.app.js.
     */
    registerInMainApp(className, folderName) {
        const mainPath = path.join(this.baseDir, 'src/main.app.js');
        if (!fs.existsSync(mainPath)) return;

        let content = fs.readFileSync(mainPath, 'utf-8');
        const importStatement = `import ${className} from './components/${folderName}/${folderName}.component.js';`;
        const registerStatement = `app.register('${className}', ${className});`;

        // 1. Add Import (after last import)
        const lines = content.split('\n');
        let lastImportIndex = -1;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('import ')) lastImportIndex = i;
        }

        if (lastImportIndex !== -1) {
            lines.splice(lastImportIndex + 1, 0, importStatement);
        } else {
            lines.unshift(importStatement);
        }

        // 2. Add Register (after last app.register or after app instantiation)
        let lastRegisterIndex = -1;
        let appInstanceIndex = -1;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes('app.register(')) lastRegisterIndex = i;
            if (lines[i].includes('new AvenxApp')) appInstanceIndex = i;
        }

        if (lastRegisterIndex !== -1) {
            lines.splice(lastRegisterIndex + 1, 0, registerStatement);
        } else if (appInstanceIndex !== -1) {
            lines.splice(appInstanceIndex + 1, 0, '', registerStatement);
        } else {
            lines.push('', registerStatement);
        }

        // 3. Add Mount (if no mount exists yet)
        const hasMount = lines.some(line => line.includes('app.mount('));
        if (!hasMount) {
            lines.push(`\napp.mount('${className}');`);
        } else {
            lines.push(`// app.mount('${className}'); // Uncomment to mount this component`);
        }

        fs.writeFileSync(mainPath, lines.join('\n'));
        console.log(`✅ Component '${className}' registered in src/main.app.js`);
    }

    /**
     * Runs the compiler build.
     */
    buildProject() {
        new AvenxCompiler().build();
    }

    getInitialHtml() {
        return `<!DOCTYPE html>
<html>
<head>
    <title>My Avenx App</title>
    <link rel="stylesheet" href="dist/bundle.css">
</head>
<body>
    <div id="app"></div>
    <script src="dist/bundle.js"></script>
</body>
</html>`;
    }

    printHelp() {
        console.log(`
Avenx-JS CLI
Usage: avenx <command> [options]

Commands:
  init              Initialize a new Avenx project structure
  generate <name>   Generate a new component (alias: g)
  build             Build the project into dist/bundle.js
  help              Show this help message
        `);
    }
}

const cli = new AvenxCLI();
cli.run(command, args);
