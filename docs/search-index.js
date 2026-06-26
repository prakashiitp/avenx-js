// Auto-generated documentation search index
window.AVENX_DOCS_INDEX = [
  {
    "id": "intro",
    "title": "Introduction",
    "category": "Getting Started",
    "filename": "intro.html",
    "path": "getting-started/intro.html",
    "keywords": [
      "introduction",
      "philosophy",
      "about",
      "reactive",
      "experimental",
      "scoped",
      "css"
    ],
    "text": "Introduction to Avenx-JS Avenx-JS is a lightweight, experimental frontend framework designed for simplicity and performance. Modern frontend frameworks often demand complex build setups, extensive configuration, and heavy runtime libraries. Avenx-JS explores an alternative path: it couples a custom compiler-driven component model with zero runtime dependencies and Proxy-based reactivity. This provides a cohesive, developer-friendly experience out of the box. Philosophy: Write clean, standard-compliant HTML, CSS, and JS, and let the compiler handle scoping, bundling, and optimization. ✨ Key Features 🔄 Proxy-Based Transparent Reactivity No useState , setState , or manual component updates. Property changes on the state object trigger selective DOM updates automatically. 🧩 Declarative SFC (Single File Components) Keep your template, local state, computed values, and actions together in a single .component.js file, alongside a scoped .component.css . 🎨 Intelligent Scoped CSS Styles defined in your component's CSS file are scoped automatically via unique hashes. Global variables are handled seamlessly using custom @def rules. 🌐 Shared Bridges (Global State) Subscribe to and share global reactive state objects easily across multiple components with zero boilerplate. 🛠️ CLI-First Tooling Scaffold, build, run a hot-reloading development server, and generate pages, components, bridges, or guards instantly with the avenx CLI."
  },
  {
    "id": "install",
    "title": "Installation",
    "category": "Getting Started",
    "filename": "install.html",
    "path": "getting-started/install.html",
    "keywords": [
      "installation",
      "npm",
      "setup",
      "install",
      "npx"
    ],
    "text": "Installation To begin using Avenx-JS, make sure you have Node.js (v16 or higher recommended) installed on your machine. Installing the Core package Install the Avenx package globally or locally in your project: Or run it directly using npx to initialize a new project structure: System Requirements Dependency Requirement Purpose Node.js v16.0.0+ Running CLI commands and local dev server NPM / Yarn v7.0.0+ Installing dependency packages Modern Browser ES6 Proxy support Required for the reactive runtime engine"
  },
  {
    "id": "quickstart",
    "title": "Quick Start Tutorial",
    "category": "Getting Started",
    "filename": "quickstart.html",
    "path": "getting-started/quickstart.html",
    "keywords": [
      "quickstart",
      "tutorial",
      "counter",
      "generate",
      "serve",
      "first",
      "component"
    ],
    "text": "Quick Start Tutorial Let's create a fully interactive Counter component in just a few minutes. Step 1: Scaffold a Project Create an empty directory, navigate into it, and initialize your project: This creates the basic workspace layout: src/ folder, index.html , and config files. Step 2: Generate a Component Generate a new component named counter using the CLI generator: This creates src/components/counter/counter.component.js and counter.component.css , and registers it in src/main.app.js . Step 3: Define Component Logic & Template Open src/components/counter/counter.component.js and update it as follows: Step 4: Define Scoped CSS Open src/components/counter/counter.component.css and define your scoped styles: Step 5: Run the Development Server Launch the built-in development server with live reload: Your browser will open to http://localhost:3000 . Modify code in real-time and watch it hot-reload!"
  },
  {
    "id": "structure",
    "title": "Project Structure",
    "category": "Getting Started",
    "filename": "structure.html",
    "path": "getting-started/structure.html",
    "keywords": [
      "structure",
      "files",
      "dist",
      "src",
      "global",
      "guards",
      "pages",
      "main.app.js"
    ],
    "text": "Project Structure When you scaffold a project using the avenx init command, it builds a organized structure designed to cleanly separate routing, components, page layout, and global configurations. Compilation Note: During builds, Avenx-JS bundles the core runtime files, your components, pages, bridges, and guards into a single dist/bundle.js and stylesheet dist/bundle.css . No runtime bundler like Webpack/Vite is needed."
  },
  {
    "id": "concepts-components",
    "title": "Component Structure",
    "category": "Core Concepts",
    "filename": "components.html",
    "path": "core-concepts/components.html",
    "keywords": [
      "components",
      "declarative",
      "sfc",
      "custom",
      "tags",
      "state",
      "computed",
      "action"
    ],
    "text": "Component Structure In Avenx-JS, a component is defined by two companion files in the same directory: <name>.component.js (logic and template) and <name>.component.css (styles). JavaScript File ( .component.js ) The component file contains configuration tags at the top and the HTML template at the bottom. The configuration tags are parsed at compile-time and stripped out before outputting class declarations. <state key=\"val\" /> - Declares the component's reactive local properties. Attributes are coerced to their corresponding JS types (numbers, booleans, arrays, or objects). <computed name=\"computedName\" value=\"expression\" /> - Defines computed getters. The value attribute accepts stringified JS expressions. <action name=\"methodName\"> ... </action> - Defines actions (methods) that have access to the component's state, computed attributes, and bridges in their execution scope."
  },
  {
    "id": "concepts-reactivity",
    "title": "Reactive State",
    "category": "Core Concepts",
    "filename": "reactivity.html",
    "path": "core-concepts/reactivity.html",
    "keywords": [
      "reactivity",
      "proxy",
      "transparent",
      "state",
      "change",
      "observer",
      "scheduler",
      "queue"
    ],
    "text": "Reactive State Avenx-JS implements a transparent reactivity system powered by JavaScript ES6 Proxy . There are no state setter functions or hooks required to update the user interface. How It Works When a component is instantiated, the framework wraps its initial state object in a reactive Proxy. When an action or callback modifies any field on state , the Proxy trap intercepts the change and queues a re-render job. Batching Updates & Scheduler To maximize browser performance, state updates are batched together. If you change multiple state properties sequentially, Avenx does not re-render the DOM for each modification. Instead, the framework queues a single microtask job to flush updates together in the next tick. Nested Reactivity Avenx-JS automatically intercepts nested object mutations. If a state property contains an array or object, mutations within that tree are tracked:"
  },
  {
    "id": "concepts-computed",
    "title": "Computed Properties",
    "category": "Core Concepts",
    "filename": "computed.html",
    "path": "core-concepts/computed.html",
    "keywords": [
      "computed",
      "caching",
      "dependency",
      "tracking",
      "circular",
      "dependency"
    ],
    "text": "Computed Properties Computed properties allow you to define state derivations that are cached and automatically updated whenever their source dependencies change. Definition Define a computed property using the <computed /> tag. It accepts a name and an expression: Dependency Tracking & Caching The reactivity system automatically traces which properties are read during the evaluation of a computed getter. It builds a dependency graph dynamically. If the variables referenced (e.g. price or tax ) do not change, accessing the computed property returns the cached value instantly without re-evaluation. When a dependency changes, the computed property is marked as dirty, triggering updates in any views or downstream computed properties depending on it. Circular Dependency Protection If you accidentally introduce a recursive loop (e.g., computed property a depends on b , which depends on a ), Avenx detects it immediately during evaluation, cancels the infinite loop, throws warning code [AVX_R04] , and returns undefined to keep the application stable."
  },
  {
    "id": "concepts-events",
    "title": "Actions & Event Handling",
    "category": "Core Concepts",
    "filename": "events.html",
    "path": "core-concepts/events.html",
    "keywords": [
      "actions",
      "events",
      "click",
      "input",
      "delegation",
      "event",
      "target",
      "custom",
      "events"
    ],
    "text": "Actions & Event Handling Avenx-JS simplifies capturing DOM events by letting you attach action handlers directly within elements using an @ prefix. Binding Events To bind an event listener, prefix the event name with @ followed by the expression to execute: Context Availability: Inside event expressions, you have access to the component's state , computed values, methods , registered bridges , and the native DOM event object. Event Delegation Avenx does not attach event listeners to every single DOM node. Instead, the runtime's EventBinder uses event delegation . It listens for events at the component's root element and determines the correct target on invocation, saving browser memory and keeping dynamic list updates fast. Custom Component Events Components can communicate with their parent containers by dispatching native or custom events. The container can capture them using standard listeners or lifecycle bindings."
  },
  {
    "id": "concepts-templates",
    "title": "Templates & Slots",
    "category": "Core Concepts",
    "filename": "templates.html",
    "path": "core-concepts/templates.html",
    "keywords": [
      "slots",
      "transclusion",
      "templates",
      "interpolation",
      "double",
      "curly",
      "triple",
      "curly",
      "loops",
      "for",
      "data-ax-bind"
    ],
    "text": "Templates, Slots & Transclusion Avenx-JS provides a clean HTML-based template engine that supports text interpolation, HTML transclusion, two-way bindings, and loops. 1. Interpolation & HTML Escaping Escaped Text ( {{ expression }} ) : Values are automatically passed through an HTML escaper to prevent Cross-Site Scripting (XSS). Raw HTML ( {{{ expression }}} ) : Allows inserting unescaped HTML. Use this with caution. 2. Two-Way Bindings ( data-ax-bind ) Form inputs (input, textarea, select) support two-way bindings via data-ax-bind . This is translated at compile-time to a value attribute and an event listener: 3. Loops ( <@for> ) Render arrays using the custom <@for> loop tag. Loop blocks are translated to <template> tags and managed via the ListManager for efficient DOM list updates: 4. Slots & Transclusion Components can receive child HTML blocks using <slot> elements. Both default and named slots are fully supported. Component Definition (e.g. Card ) Component Usage"
  },
  {
    "id": "concepts-styling",
    "title": "Scoped & Global CSS",
    "category": "Core Concepts",
    "filename": "styling.html",
    "path": "core-concepts/styling.html",
    "keywords": [
      "css",
      "styling",
      "scoped",
      "global",
      "def",
      "@css",
      "@global",
      "nesting"
    ],
    "text": "Scoped & Global CSS Styling is defined in the companion .component.css stylesheet. At compile-time, the Avenx compiler scopes component styles to keep them from bleeding into other views. 1. Scoped CSS Blocks ( <@css> ) CSS rules defined inside <@css> are hashed and appended with a unique class suffix. The compiler extracts this CSS and merges the generated class directly into the component's HTML tags. 2. Global CSS & Custom Variables ( <@global> ) Declare global styles or design token variables using the <@global> block. Use the @def directive to define custom color codes or measurements. The compiler replaces these variables statically at build time."
  },
  {
    "id": "concepts-bridges",
    "title": "Shared State & Bridges",
    "category": "Core Concepts",
    "filename": "bridges.html",
    "path": "core-concepts/bridges.html",
    "keywords": [
      "bridges",
      "global",
      "state",
      "shared",
      "state",
      "store",
      "global",
      "bridge.js"
    ],
    "text": "Shared State & Bridges Bridges provide an elegant, lightweight solution for sharing state and business logic across multiple components or pages without prop-drilling. Creating a Bridge Generate a new bridge using the CLI tool: This creates a file in src/global/auth.bridge.js . Export a standard JavaScript object representing the state: Using Bridges in Components Bridges are automatically loaded and registered by the compiler. They are exposed directly to component templates and actions under their capitalized name postfixed with Bridge (e.g. AuthBridge ). Reactivity: Mutations to a bridge trigger updates on all components referencing that bridge, ensuring state sync across your entire application automatically."
  },
  {
    "id": "concepts-routing",
    "title": "Pages & Routing",
    "category": "Core Concepts",
    "filename": "routing.html",
    "path": "core-concepts/routing.html",
    "keywords": [
      "routing",
      "router",
      "pages",
      "guards",
      "canActivate",
      "params",
      "hashchange"
    ],
    "text": "Pages & Routing Avenx-JS features a built-in router designed for single-page applications. It handles hash-based navigation (e.g. #/dashboard ), dynamic parameters, and guards. 1. Page Components ( .page.js ) Pages are top-level components located inside src/pages/ . They extend AvenxPage instead of AvenxComponent , enabling them to host child components dynamically. 2. Configuring the Router Define routes in your src/main.app.js file by mapping path patterns to page names: 3. Dynamic Route Parameters Route segments starting with : are dynamic variables. The values parsed from the URL are automatically added to the Page component's state object and can be read inside templates or actions: 4. Route Guards Guards decide whether a transition to a page is allowed. Create a guard using the CLI: Implement the canActivate(to, from) method. Return a boolean, a redirect string, or a Promise: Map guards to routes in your application router initialization:"
  },
  {
    "id": "cli-commands",
    "title": "CLI Commands",
    "category": "CLI Reference",
    "filename": "commands.html",
    "path": "cli-reference/commands.html",
    "keywords": [
      "cli",
      "commands",
      "init",
      "generate",
      "build",
      "serve",
      "watch",
      "live-reload"
    ],
    "text": "CLI Reference The avenx command line tool streamlines your workflow. It handles application scaffolding, file generation, building, and serving. Command Syntax Available Commands 1. avenx init Scaffolds a new project structure in the current working directory. It creates subdirectories (components, pages, global, guards, dist) and sets up standard configuration files ( index.html , src/main.app.js , .vscode/settings.json ). 2. avenx generate (alias: g ) Generates boilerplate code for components, pages, bridges, and guards. Component : npx avenx g counter Creates src/components/counter/counter.component.js and .css , and registers it in main.app.js . Page : npx avenx g p dashboard Creates src/pages/dashboard.page.js and .css for routing. Bridge : npx avenx g bridge settings Creates a global state bridge at src/global/settings.bridge.js . Guard : npx avenx g guard admin Creates a routing guard at src/guards/admin.guard.js . 3. avenx build (alias: b ) Compiles all components, styles, pages, and bridges into dist/bundle.js and dist/bundle.css . It strips out runtime imports/exports to create a clean, single-file bundle that can be loaded in browsers directly. 4. avenx serve [port] Starts a local hot-reloading development server (default port: 3000). It watches the src/ directory for changes, automatically triggers a rebuild, and sends a live reload event to connected browser instances via a Server-Sent Events (SSE) bridge."
  },
  {
    "id": "api-app",
    "title": "AvenxApp API",
    "category": "API Reference",
    "filename": "app.html",
    "path": "api-reference/app.html",
    "keywords": [
      "avenxapp",
      "register",
      "registerpage",
      "initrouter",
      "registerbridge",
      "mount",
      "api"
    ],
    "text": "AvenxApp API The core coordinator class for your application. It holds mappings of components, pages, active bridges, and handles mounting elements onto the DOM. Constructor Param Type Description config.target string A valid DOM selector (e.g., '#app' ) pointing to the root element. Throws exception [AVX_R01] if not found. Public Methods register(name, compClass) Registers a component class so it can be resolved by component tag names in templates. registerPage(name, pageClass) Registers a page view class for routing. initRouter(routes) Instantiates and starts the hash-based router. Accepts a route mapping configuration object. registerBridge(name, bridgeData) Registers a global reactive state bridge. The bridge will be initialized and exposed to all components."
  },
  {
    "id": "api-component",
    "title": "AvenxComponent API",
    "category": "API Reference",
    "filename": "component.html",
    "path": "api-reference/component.html",
    "keywords": [
      "avenxcomponent",
      "state",
      "props",
      "update",
      "mount",
      "unmount",
      "onmount",
      "onupdate",
      "onunmount"
    ],
    "text": "AvenxComponent API The base class from which all standard UI components inherit. It manages reactivity, templates, lifecycle methods, and slot rendering. Properties this.state (Proxy): The reactive state instance for local properties. Changing state triggers updates automatically. this.props (Proxy): The reactive attributes passed by parent tags. Modifications from parents trigger updates. Lifecycle Hooks Implement these functions in your component logic to execute code at specific points in the component's lifespan: Method Name Description onMount() Called immediately after the component's element is attached to the DOM. Place your initial data fetches here. onUpdate() Called after the component has updated and patched the DOM tree. Use this for DOM measurements. onUnmount() Called before the component is detached and cleaned up. Ideal for removing timers and global listeners. Core Methods mount(target) Mounts the component to the target DOM element or selector. unmount() Cleans up event listeners and empties the mounted container. update() Forces a DOM patch and re-evaluates slots. Typically called automatically by the scheduler."
  },
  {
    "id": "api-page",
    "title": "AvenxPage API",
    "category": "API Reference",
    "filename": "page.html",
    "path": "api-reference/page.html",
    "keywords": [
      "avenxpage",
      "page",
      "class",
      "child",
      "components",
      "routing",
      "views"
    ],
    "text": "AvenxPage API A specialized sub-class extending AvenxComponent . Pages represent root layouts in router configurations. Key Differences from AvenxComponent Child Component Resolution : Pages are configured with a registry of components. Whenever a page renders, it scans the DOM for custom element tags (e.g. <div data-avenx-comp=\"Navbar\"> ) and instantiates them automatically. Props Propagation : If a child component is declared with attributes (e.g., <Card title=\"My Card\" /> ), AvenxPage extracts and feeds them to the child component as props dynamically."
  },
  {
    "id": "api-router-guard",
    "title": "AvenxRouter & Guard API",
    "category": "API Reference",
    "filename": "router-guard.html",
    "path": "api-reference/router-guard.html",
    "keywords": [
      "avenxrouter",
      "avenxguard",
      "navigate",
      "canactivate",
      "guards"
    ],
    "text": "AvenxRouter & AvenxGuard API Classes responsible for navigation controls and route access authorization. AvenxRouter Created by calling AvenxApp.initRouter() . Methods navigate(hash) : Programs a transition to another hash path. destroy() : Removes routing event listeners from the window. AvenxGuard Route guards extend AvenxGuard . Override the following method to implement route access validation: canActivate(to, from) Called before navigating to a route. Param Properties Description to hash, page, params Target route details. from hash, page, params Current route details (or null if initial load). Returns: boolean (true to allow, false to deny) or string (a redirect hash like '#/login' )."
  },
  {
    "id": "api-utils",
    "title": "Utility Functions",
    "category": "API Reference",
    "filename": "utils.html",
    "path": "api-reference/utils.html",
    "keywords": [
      "utilities",
      "html",
      "safehtml",
      "htmlescaper",
      "xss",
      "escape"
    ],
    "text": "Utility Functions Helper classes and tags to manage security and custom markup insertions. 1. html template tag Creates a SafeHtml wrapper around a template literal, allowing you to build raw HTML content safely. Parameters inserted are automatically escaped unless they are instances of SafeHtml . 2. SafeHtml class A wrapper class designating that a string is verified and safe for raw output. Evaluated directly without escaping inside {{{ ... }}} expressions. 3. HtmlEscaper Internal utility class providing character replacement mappings to prevent code injections:"
  },
  {
    "id": "errors-reference",
    "title": "Error Codes",
    "category": "Troubleshooting",
    "filename": "errors.html",
    "path": "troubleshooting/errors.html",
    "keywords": [
      "errors",
      "avx_c",
      "avx_r",
      "troubleshooting",
      "exception",
      "circular",
      "dependency"
    ],
    "text": "Error Codes Reference Avenx-JS uses structured error codes starting with AVX_C for compiler errors and AVX_R for runtime issues. Compiler Codes ( AVX_C* ) Code Default Message Cause & Resolution [AVX_C01] Could not create dist directory at \"{dir}\". Cause: Write permission failure. Resolution: Adjust your operating system directory write permissions. [AVX_C02] \"src\" directory not found. Cause: Running the build command outside of an Avenx project root. Resolution: Run npx avenx init to set up the workspace. Runtime Codes ( AVX_R* ) Code Default Message Cause & Resolution [AVX_R01] Mount target selector \"{selector}\" was not found in the DOM. Cause: Missing container tag in index.html . Resolution: Verify your index file has a matching tag like <div id=\"app\"></div> . [AVX_R02] Page \"{name}\" is not registered. Cause: Mapping route patterns to non-existent or un-compiled pages. Resolution: Check spelling and verify page JS exists inside src/pages/ . [AVX_R03] Component \"{name}\" is not registered. Cause: Declaring a custom component tag (e.g. <MyButton /> ) without registering it. Resolution: Import and register it inside src/main.app.js . [AVX_R04] Circular dependency detected in computed property \"{name}\". Cause: Computed getters reference themselves directly or indirectly. Resolution: Refactor computed expressions so they do not reference their own keys. [AVX_R05] Failed to evaluate computed property \"{name}\". Cause: Unhandled exceptions inside custom getter scripts. Resolution: Review expression syntax and ensure referenced states are defined. [AVX_R06] Navigation guard denied transition. Cause: A guard returned false (Expected behavior for access controls). [AVX_R07] Navigation guard threw an error. Cause: Route guard evaluations failed. Resolution: Wrap asynchronous fetches in try/catch blocks. [AVX_R08] Failed to render interpolation expression \"{expr}\". Cause: Accessing properties on undefined or null properties. Resolution: Guard properties in template: {{ state.user ? state.user.name : '' }} . [AVX_R09] Event handler execution failed. Cause: Unhandled exceptions in event listener actions. Resolution: Verify method declarations match event expressions. [AVX_R10] Bridge \"{name}\" already exists. Cause: Duplicate registrations. Resolution: Assign unique names to bridges."
  },
  {
    "id": "best-practices-guide",
    "title": "Best Practices",
    "category": "Best Practices",
    "filename": "guide.html",
    "path": "best-practices/guide.html",
    "keywords": [
      "best",
      "practices",
      "performance",
      "security",
      "optimization",
      "xss",
      "list",
      "keys"
    ],
    "text": "Best Practices Guide Maximize performance and security in your Avenx-JS applications by adhering to the following guidelines. security Security and XSS Prevention Use Double Curly Braces ( {{ ... }} ) by Default : Always use double curly braces for content interpolation, as it automatically encodes special HTML entities to prevent script injection. Restrict Triple Curly Braces ( {{{ ... }}} ) : Only use triple braces when rendering trusted content. Sanitise raw data before outputting. Dynamic URL Attributes : Be cautious when binding variables to element URLs (such as href or src ) to prevent javascript: payload executions. bolt Performance Optimisations Assign Unique Keys to Loops : When using the <@for> loop, always provide a key attribute (e.g. key=\"item.id\" ). This allows the ListManager to identify elements uniquely and move existing DOM elements instead of rebuilding them. Clean up Global Listeners : If your actions subscribe to window events or set timers, always clean them up in the onUnmount() lifecycle callback to prevent memory leaks: Leverage Computed caching : Avoid putting heavy calculation scripts inside component actions or template interpolations directly. Define them in a <computed> tag so that the runtime caching mechanism can prevent redundant executions."
  }
];
