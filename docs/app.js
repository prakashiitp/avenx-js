/**
 * Avenx-JS Docs Application Client-Side Controller
 * Handles multi-page search, theme persistence, code highlighting, and mobile navigation drawer.
 */

(function () {
    'use strict';

    // State Variables
    let searchInput, clearSearchBtn, searchResults;
    let sidebar, sidebarBackdrop, themeToggle, mobileToggle;

    // Syntax Highlighting Engine
    function highlightJS(code) {
        return code.replace(
            /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`[\s\S]*?`)|(\b(const|let|var|function|return|class|extends|import|export|default|new|typeof|super|this|state|props|args|event|onMount|onUpdate|onUnmount)\b)|(\b(AvenxApp|AvenxComponent|AvenxPage|AvenxRouter|AvenxGuard|AvenxBridge|HtmlEscaper|SafeHtml|Sanitizer|DynamicEvaluator|LifecycleManager)\b)|(\b\d+\b)/g,
            (match, comment, string, keyword, keywordWord, className, classWord, number) => {
                if (comment) return `<span class="token-comment">${comment}</span>`;
                if (string) return `<span class="token-string">${string}</span>`;
                if (keyword) return `<span class="token-keyword">${keyword}</span>`;
                if (className) return `<span class="token-class">${className}</span>`;
                if (number) return `<span class="token-number">${number}</span>`;
                return match;
            }
        );
    }

    function highlightCSS(code) {
        return code.replace(
            /(\/\*[\s\S]*?\*\/)|(@def|@css|@global|@media|@supports|@keyframes)|(:\s*[^;}]+)|(\b(color|background-color|background|border-radius|border|padding|margin|font-family|font-size|box-shadow|text-align|max-width|opacity|cursor|font-weight|transition|display|flex-direction|flex|justify-content|align-items|position|top|left|right|bottom|z-index|height|width|gap|min-height|overflow-y|transform|box-sizing|line-height|letter-spacing|scroll-behavior|list-style)\b)/g,
            (match, comment, keyword, valBlock, prop) => {
                if (comment) return `<span class="token-comment">${comment}</span>`;
                if (keyword) return `<span class="token-keyword">${keyword}</span>`;
                if (prop) return `<span class="token-attribute">${prop}</span>`;
                if (valBlock) {
                    const val = valBlock.replace(/(\b(none|white|transparent|center|fixed|hidden|absolute|relative|block|flex|column|sans-serif|monospace|bold|pointer)\b|\d+px|\d+rem|\d+em|\d+s|\d+ms|#[a-fA-F0-9]{3,8})/g, '<span class="token-value">$1</span>');
                    return val;
                }
                return match;
            }
        );
    }

    function highlightHTML(code) {
        let escaped = code
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
            
        escaped = escaped.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="token-comment">$1</span>');
        escaped = escaped.replace(/(\{\{\{[\s\S]*?\}\}\}|\{\{[\s\S]*?\}\})/g, '<span class="token-keyword">$1</span>');

        escaped = escaped.replace(/(&lt;\/?)([A-Za-z0-9@_$-]+)([\s\S]*?)(\/?&gt;)/g, (match, openTag, tagName, attrs, closeTag) => {
            let parsedAttrs = attrs;
            parsedAttrs = parsedAttrs.replace(/(\b[\w:-]+|@[\w-]+)(?=\s*=)/g, '<span class="token-attribute">$1</span>');
            parsedAttrs = parsedAttrs.replace(/("[^"]*"|'[^']*')/g, '<span class="token-value">$1</span>');
            return `${openTag}<span class="token-tag">${tagName}</span>${parsedAttrs}${closeTag}`;
        });

        return escaped;
    }

    function highlightPageCode() {
        const codeBlocks = document.querySelectorAll('pre code');
        codeBlocks.forEach(block => {
            const codeClass = block.className || '';
            const codeText = block.textContent;
            
            if (codeClass.includes('language-javascript') || codeClass.includes('language-js')) {
                block.innerHTML = highlightJS(codeText);
            } else if (codeClass.includes('language-css')) {
                block.innerHTML = highlightCSS(codeText);
            } else if (codeClass.includes('language-html') || codeClass.includes('language-xml')) {
                block.innerHTML = highlightHTML(codeText);
            }
        });
    }

    // Dynamic Code Block Enhancement (Wrapper with Language Title and Copy Button)
    function setupCodeBlocks() {
        const preBlocks = document.querySelectorAll('pre');
        preBlocks.forEach(pre => {
            if (pre.parentElement.classList.contains('code-block-container')) {
                return;
            }

            const code = pre.querySelector('code');
            if (!code) return;

            const codeClass = code.className || '';
            let lang = 'code';
            if (codeClass.includes('language-javascript') || codeClass.includes('language-js')) {
                lang = 'javascript';
            } else if (codeClass.includes('language-css')) {
                lang = 'css';
            } else if (codeClass.includes('language-html')) {
                lang = 'html';
            } else if (codeClass.includes('language-xml')) {
                lang = 'xml';
            } else if (codeClass.includes('language-bash') || codeClass.includes('language-sh')) {
                lang = 'bash';
            }

            const container = document.createElement('div');
            container.className = 'code-block-container';

            const header = document.createElement('div');
            header.className = 'code-block-header';

            const langSpan = document.createElement('span');
            langSpan.className = 'code-block-lang';
            langSpan.textContent = lang;

            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-code-btn';
            copyBtn.innerHTML = '<span class="material-symbols-outlined">content_copy</span> Copy';

            copyBtn.addEventListener('click', () => {
                const textToCopy = code.textContent;
                navigator.clipboard.writeText(textToCopy).then(() => {
                    copyBtn.innerHTML = '<span class="material-symbols-outlined">check</span> Copied!';
                    setTimeout(() => {
                        copyBtn.innerHTML = '<span class="material-symbols-outlined">content_copy</span> Copy';
                    }, 1500);
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                });
            });

            header.appendChild(langSpan);
            header.appendChild(copyBtn);

            pre.parentNode.insertBefore(container, pre);
            container.appendChild(header);
            container.appendChild(pre);
        });
    }

    // Dynamic Alert Box Enhancement (Icon Injector)
    function setupAlerts() {
        const alerts = document.querySelectorAll('.alert');
        alerts.forEach(alert => {
            if (alert.querySelector('.alert-icon')) {
                return;
            }

            const iconSpan = document.createElement('span');
            iconSpan.className = 'alert-icon';
            
            let iconName = 'info';
            if (alert.classList.contains('warning')) {
                iconName = 'warning';
            } else if (alert.classList.contains('tip') || alert.classList.contains('note')) {
                iconName = 'info';
            }
            
            iconSpan.innerHTML = `<span class="material-symbols-outlined">${iconName}</span>`;

            const contentDiv = document.createElement('div');
            contentDiv.className = 'alert-content';
            
            while (alert.firstChild) {
                contentDiv.appendChild(alert.firstChild);
            }
            
            alert.appendChild(iconSpan);
            alert.appendChild(contentDiv);
        });
    }

    // Theme Management
    function initTheme() {
        const storedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', storedTheme);
    }

    // Toggle Dark/Light Mode
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }

    // Mobile Sidebar Drawer
    function openSidebar() {
        sidebar.classList.add('open');
        sidebarBackdrop.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        sidebar.classList.remove('open');
        sidebarBackdrop.classList.remove('show');
        document.body.style.overflow = '';
    }

    // Calculate relative link from current page to target page path
    function getRelativeLink(targetPath) {
        if (!window.CURRENT_PAGE) return targetPath;
        const currentCategory = window.CURRENT_PAGE.category;
        const prefix = currentCategory ? '../' : './';
        return `${prefix}${targetPath}`;
    }

    // Multi-page Search Engine using search-index.js
    function handleSearch(query) {
        const cleanQuery = query.toLowerCase().trim();
        
        if (!cleanQuery) {
            searchResults.style.display = 'none';
            clearSearchBtn.style.display = 'none';
            return;
        }

        clearSearchBtn.style.display = 'block';

        if (!window.AVENX_DOCS_INDEX) {
            searchResults.innerHTML = '<div class="no-results-msg">Search index loading...</div>';
            searchResults.style.display = 'block';
            return;
        }

        const matches = window.AVENX_DOCS_INDEX.filter(page => {
            return (
                page.title.toLowerCase().includes(cleanQuery) ||
                page.category.toLowerCase().includes(cleanQuery) ||
                page.keywords.some(kw => kw.toLowerCase().includes(cleanQuery)) ||
                page.text.toLowerCase().includes(cleanQuery)
            );
        });

        if (matches.length === 0) {
            searchResults.innerHTML = '<div class="no-results-msg">No documentation matches found</div>';
        } else {
            let dropdownHtml = '';
            matches.slice(0, 5).forEach(match => {
                const textContent = match.text;
                const queryIndex = textContent.toLowerCase().indexOf(cleanQuery);
                let snippet = '';
                
                if (queryIndex !== -1) {
                    const start = Math.max(0, queryIndex - 40);
                    const end = Math.min(textContent.length, queryIndex + 80);
                    snippet = '...' + textContent.substring(start, end).trim() + '...';
                } else {
                    snippet = textContent.substring(0, 100).trim() + '...';
                }

                const relativeLink = getRelativeLink(match.path);

                dropdownHtml += `<a href="${relativeLink}" class="search-result-item">
                    <div class="result-title">${match.title}</div>
                    <div class="result-snippet">${snippet}</div>
                </a>`;
            });
            searchResults.innerHTML = dropdownHtml;
        }

        searchResults.style.display = 'block';
    }

    // Event Listeners Configuration
    function setupEvents() {
        // Mobile sidebar navigation toggling
        if (mobileToggle && sidebar) {
            mobileToggle.addEventListener('click', () => {
                if (sidebar.classList.contains('open')) {
                    closeSidebar();
                } else {
                    openSidebar();
                }
            });
        }

        if (sidebarBackdrop) {
            sidebarBackdrop.addEventListener('click', closeSidebar);
        }

        // Theme switching
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }

        // Search inputs
        if (searchInput && clearSearchBtn && searchResults) {
            searchInput.addEventListener('input', (e) => handleSearch(e.target.value));
            
            clearSearchBtn.addEventListener('click', () => {
                searchInput.value = '';
                handleSearch('');
            });

            // Hide search results dropdown on click outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.search-container')) {
                    searchResults.style.display = 'none';
                }
            });

            // Navigate search results using click
            searchResults.addEventListener('click', () => {
                searchResults.style.display = 'none';
                searchInput.value = '';
                clearSearchBtn.style.display = 'none';
            });
        }

        // Focus search container using '/' shortcut key
        document.addEventListener('keydown', (e) => {
            if (e.key === '/' && document.activeElement !== searchInput && searchInput) {
                e.preventDefault();
                searchInput.focus();
                searchInput.select();
            }
        });
    }

    // Application Bootstrap
    function bootstrap() {
        // Cache DOM elements
        sidebar = document.getElementById('app-sidebar');
        sidebarBackdrop = document.getElementById('sidebar-backdrop');
        themeToggle = document.getElementById('theme-toggle');
        mobileToggle = document.getElementById('mobile-toggle');
        searchInput = document.getElementById('search-input');
        clearSearchBtn = document.getElementById('clear-search');
        searchResults = document.getElementById('search-results');

        setupEvents();
        setupCodeBlocks();
        setupAlerts();
        highlightPageCode();
    }

    // Run theme initialization synchronously to avoid color flashes
    initTheme();

    // Run app once DOM load complete
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrap);
    } else {
        bootstrap();
    }

})();
