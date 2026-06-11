export class HtmlDiff {
    diff(currentHtml, nextHtml) {
        return currentHtml === nextHtml ? null : nextHtml;
    }
}
