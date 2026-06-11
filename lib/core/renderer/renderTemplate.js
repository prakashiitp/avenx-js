export class TemplateRenderer {
    render(template, resolveExpression) {
        return template.replace(/\{\{\s*(.*?)\s*\}\}/g, (_, expression) => {
            try {
                const value = resolveExpression(expression);
                return value == null ? '' : String(value);
            } catch (error) {
                console.warn("Avenx Render Warning:", error, "Expression:", expression);
                return '';
            }
        });
    }
}
