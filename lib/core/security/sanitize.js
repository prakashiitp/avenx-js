export class Sanitizer {
    sanitize(value) {
        return value == null ? '' : String(value);
    }
}
