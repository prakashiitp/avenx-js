export class DomPatcher {
    patch(target, html) {
        if (target.innerHTML !== html) {
            target.innerHTML = html;
        }
    }
}
